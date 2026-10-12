import { screen, waitFor, within } from '@testing-library/react'
import { getAssetById, resetStore } from '../services/assetService.js'
import { renderApp } from './renderApp.jsx'

beforeEach(() => {
  resetStore()
})

/** The <dd> value for a label in the details list. */
const detail = (label) => screen.getByText(label, { selector: 'dt' }).nextSibling

describe('Asset details page', () => {
  it('shows every field of the asset', async () => {
    renderApp('/assets/1')
    expect(await screen.findByRole('heading', { name: 'Dell Latitude 7440' })).toBeInTheDocument()
    expect(screen.getByText('Asset ID 1')).toBeInTheDocument()
    expect(detail('Type')).toHaveTextContent('Laptop')
    expect(detail('Serial number')).toHaveTextContent('DL7440-8F2K19')
    expect(detail('Assigned to')).toHaveTextContent('Reem Alshehri')
    expect(detail('Condition')).toHaveTextContent('Good')
    expect(detail('Purchase date')).toHaveTextContent('14 Feb 2025')
    expect(screen.getByText('Assigned', { selector: '.chip' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Edit asset' })).toHaveAttribute('href', '/assets/1/edit')
    expect(screen.getByRole('link', { name: '← Back to assets' })).toHaveAttribute('href', '/assets')
  })

  it('shows a friendly message for an unknown id', async () => {
    renderApp('/assets/99')
    expect(await screen.findByRole('heading', { name: 'Asset not found' })).toBeInTheDocument()
    expect(screen.getByText('No asset with ID 99.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to the assets list' })).toHaveAttribute('href', '/assets')
  })
})

describe('Add asset form', () => {
  it('shows the three required errors when submitted empty', async () => {
    const { user } = renderApp('/assets/new')
    await user.click(screen.getByRole('button', { name: 'Add asset' }))
    expect(screen.getByText('Device name is required.')).toBeInTheDocument()
    expect(screen.getByText('Serial number is required.')).toBeInTheDocument()
    expect(screen.getByText('Pick a purchase date.')).toBeInTheDocument()
    expect(screen.getByLabelText('Device name')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Device name')).toHaveClass('bad')
    expect(screen.getByLabelText('Device name')).toHaveFocus()
  })

  it('requires an employee only when status is Assigned', async () => {
    const { user } = renderApp('/assets/new')
    await user.selectOptions(screen.getByLabelText('Availability'), 'ASSIGNED')
    await user.click(screen.getByRole('button', { name: 'Add asset' }))
    expect(screen.getByText('Enter who this asset is assigned to.')).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Availability'), 'IN_REPAIR')
    expect(screen.queryByText('Enter who this asset is assigned to.')).not.toBeInTheDocument()
  })

  it('adds a valid asset, shows the toast and goes to the last page', async () => {
    const { user, location } = renderApp('/assets/new')
    await user.type(screen.getByLabelText('Device name'), '  Dell Precision 5680 ')
    await user.selectOptions(screen.getByLabelText('Type'), 'LAPTOP')
    await user.type(screen.getByLabelText('Serial number'), 'DP5680-NEW001')
    await user.type(screen.getByLabelText('Purchase date'), '2026-09-01')
    await user.selectOptions(screen.getByLabelText('Availability'), 'ASSIGNED')
    await user.type(screen.getByLabelText(/Assigned employee/), 'Sara Alqahtani')
    await user.click(screen.getByRole('button', { name: 'Add asset' }))

    expect(await screen.findByText('Asset added with ID 13')).toBeInTheDocument()
    await waitFor(() => expect(location().pathname + location().search).toBe('/assets?page=3'))
    expect(await screen.findByText('Showing 11–13 of 13 assets')).toBeInTheDocument()
    const row = screen.getByRole('link', { name: 'Dell Precision 5680' }).closest('tr')
    expect(row).toHaveTextContent('Sara Alqahtani')
    expect(row).toHaveTextContent('1 Sep 2026')
  })

  it('shows a duplicate serial (409) under the serial field', async () => {
    const { user, location } = renderApp('/assets/new')
    await user.type(screen.getByLabelText('Device name'), 'Copy')
    await user.type(screen.getByLabelText('Serial number'), 'pf3z7q21')
    await user.type(screen.getByLabelText('Purchase date'), '2026-09-01')
    await user.click(screen.getByRole('button', { name: 'Add asset' }))
    expect(await screen.findByText('An asset with this serial number already exists.')).toBeInTheDocument()
    expect(screen.getByLabelText('Serial number')).toHaveAttribute('aria-invalid', 'true')
    expect(location().pathname).toBe('/assets/new')
  })
})

describe('Edit asset form', () => {
  it('is prefilled, and saving updates the details page', async () => {
    const { user, location } = renderApp('/assets/3/edit')
    const name = await screen.findByLabelText('Device name')
    expect(name).toHaveValue('Lenovo ThinkPad X1 Carbon')
    expect(screen.getByLabelText('Serial number')).toHaveValue('PF3Z7Q21')
    expect(screen.getByLabelText('Purchase date')).toHaveValue('2024-09-30')
    expect(screen.getByLabelText('Availability')).toHaveValue('AVAILABLE')
    expect(screen.getByText('Inventory · Edit · ID 3')).toBeInTheDocument()

    await user.clear(name)
    await user.type(name, 'ThinkPad X1 Carbon Gen 12')
    await user.selectOptions(screen.getByLabelText('Condition'), 'FAIR')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByText('Asset updated')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'ThinkPad X1 Carbon Gen 12' })).toBeInTheDocument()
    expect(location().pathname).toBe('/assets/3')
    expect(detail('Condition')).toHaveTextContent('Fair')
  })

  it('Cancel returns to the previous page', async () => {
    const { user, location } = renderApp('/assets/3')
    await user.click(await screen.findByRole('link', { name: 'Edit asset' }))
    await user.click(await screen.findByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(location().pathname).toBe('/assets/3'))
  })

  it('shows not-found for an unknown id', async () => {
    renderApp('/assets/99/edit')
    expect(await screen.findByText('No asset with ID 99.')).toBeInTheDocument()
  })
})

describe('Delete', () => {
  it('Cancel keeps the row; Delete removes it and shows a toast', async () => {
    const { user } = renderApp('/assets')
    await user.click(await screen.findByRole('button', { name: 'Delete Dell Latitude 7440' }))

    const dialog = screen.getByRole('alertdialog', { name: 'Delete this asset?' })
    expect(dialog).toHaveTextContent('Dell Latitude 7440 will be removed from the inventory. This can’t be undone.')
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus()

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dell Latitude 7440' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete Dell Latitude 7440' }))
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText('Dell Latitude 7440 deleted')).toBeInTheDocument()
    expect(await screen.findByText('Showing 1–5 of 11 assets')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Dell Latitude 7440' })).not.toBeInTheDocument()
    await expect(getAssetById(1)).rejects.toMatchObject({ status: 404 })
  })

  it('Escape closes the dialog without deleting', async () => {
    const { user } = renderApp('/assets')
    await user.click(await screen.findByRole('button', { name: 'Delete Dell Latitude 7440' }))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect((await getAssetById(1)).id).toBe(1)
  })

  it('deleting from the details page returns to the list', async () => {
    const { user, location } = renderApp('/assets/7')
    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete' }))
    expect(await screen.findByText('HP EliteBook 840 G10 deleted')).toBeInTheDocument()
    await waitFor(() => expect(location().pathname).toBe('/assets'))
    expect(await screen.findByText('Showing 1–5 of 11 assets')).toBeInTheDocument()
  })
})
