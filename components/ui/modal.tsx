import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import type { Person } from '@/types/wedding-config'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  member: Person | null
}

export default function MemberModal({ isOpen, onClose, member }: ModalProps) {
  if (!member) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute right-4 top-4">
                  <button
                    type="button"
                    className="rounded-full bg-white/50 p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="relative w-48 h-48 mx-auto mb-6 overflow-hidden rounded-full ring-4 ring-rose-100">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                </div>

                <Dialog.Title
                  as="h3"
                  className="text-2xl font-serif text-center text-rose-700 mb-2"
                >
                  {member.name}
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div className="text-center">
                    <p className="text-rose-600 font-medium text-lg">{member.role}</p>
                    <p className="text-gray-600 mt-1">{member.relationship}</p>
                  </div>

                  {member.message && (
                    <div className="mt-4 p-4 bg-rose-50/50 rounded-lg">
                      <p className="text-gray-700 italic text-center">"{member.message}"</p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 