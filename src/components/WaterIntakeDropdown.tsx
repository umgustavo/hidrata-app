import { Plus, PlusCircle } from '@phosphor-icons/react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import { getWaterMLFromType } from '../utils/helpers'
import { ContainerType, ItemsType } from '../utils/storage/schema'

export type ItemsTypeAddCustom = ItemsType | 'add-custom'

type DropdownItemType = {
    type: ItemsTypeAddCustom
    label: string
    icon?: React.ReactNode
    shortcut?: string
}

interface WaterIntakeDropdownProps {
    containers: ContainerType
    onAdd: (type: ItemsType, quantity?: number, label?: string) => void
    onOpenModal?: () => void
}

interface DropdownItemProps {
    type: ItemsTypeAddCustom
    label?: string
    icon?: React.ReactNode
    shortcut?: string
    quantity?: number
    isMac: boolean
    handleClick: (id: ItemsTypeAddCustom, quantity?: number, label?: string) => void
}

function DropdownItem({
    type,
    icon,
    label,
    quantity,
    handleClick,
    shortcut,
    isMac,
}: DropdownItemProps) {
    const _handleClick = () => {
        if (type === 'custom') return handleClick(type, quantity, label)
        handleClick(type)
    }

    return (
        <DropdownMenuPrimitive.Item
            className={clsx(
                'flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none',
                'text-zinc-500 focus:bg-zinc-800'
            )}
            onClick={_handleClick}
        >
            <div className='text-zinc-300 flex items-center gap-1.5 flex-grow overflow-hidden'>
                {icon}
                <span>
                    {type === 'custom'
                        ? label
                            ? `${label} (${quantity} ml)`
                            : `${quantity} ml`
                        : label}
                </span>
            </div>
            {shortcut && (
                <span className='text-sm'>
                    {isMac ? '⌘ + ' : 'Ctrl + '}
                    {shortcut}
                </span>
            )}
        </DropdownMenuPrimitive.Item>
    )
}

export function WaterIntakeDropdown({ onAdd, onOpenModal, containers }: WaterIntakeDropdownProps) {
    const isMac = navigator.userAgent.indexOf('Mac') !== -1

    // Itens padrão do dropdown
    const dropdownItems: DropdownItemType[] = [
        {
            type: 'glass',
            label: `Copo (${getWaterMLFromType('glass')} ml)`,
        },
        {
            type: 'bottle',
            label: `Garrafa (${getWaterMLFromType('bottle')} ml)`,
        },
    ]

    const lastItem: DropdownItemType = {
        type: 'add-custom',
        label: 'Adicionar',
        icon: <PlusCircle weight='bold' size={18} />,
    }

    const handleClick = (id: ItemsTypeAddCustom, quantity?: number, label?: string) => {
        if (id === 'add-custom') return onOpenModal ? onOpenModal() : null
        if (id === 'custom') return onAdd(id, quantity, label)
        onAdd(id)
    }

    return (
        <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger asChild>
                <button
                    className='p-1.5 rounded-md bg-transparent hover:bg-white/20 transition-colors ring-focus'
                    title='Novo registro'
                >
                    <Plus size={18} weight='bold' />
                </button>
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                    align='end'
                    sideOffset={5}
                    className={clsx(
                        'radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
                        'w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56',
                        'bg-zinc-900'
                    )}
                >
                    {dropdownItems.map(({ type, label, icon, shortcut }) => (
                        <DropdownItem
                            key={`${type}-${label}`}
                            type={type}
                            label={label}
                            icon={icon}
                            shortcut={shortcut}
                            isMac={isMac}
                            handleClick={handleClick}
                        />
                    ))}

                    {containers.map(({ id, quantity, label }) => (
                        <DropdownItem
                            key={`${id}-${label}`}
                            type='custom'
                            label={label}
                            quantity={quantity}
                            isMac={isMac}
                            handleClick={handleClick}
                        />
                    ))}

                    <div className='h-[2px] bg-zinc-800 my-1' />

                    {lastItem && (
                        <DropdownItem
                            type={lastItem.type}
                            label={lastItem.label}
                            icon={lastItem.icon}
                            shortcut={lastItem.shortcut}
                            isMac={isMac}
                            handleClick={handleClick}
                        />
                    )}
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    )
}
