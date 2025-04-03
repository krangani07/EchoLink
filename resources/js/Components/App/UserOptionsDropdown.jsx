import { Menu, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEventBus } from "@/Eventbus";

export default function UserOptionsDropdown({ conversation }) {
    const { emit } = useEventBus();
    const isChangingRole = useRef(false);
    const isTogglingBlock = useRef(false);

    const changeUserRole = (e, closeMenu) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isChangingRole.current || !conversation.is_user) return;

        isChangingRole.current = true;
        closeMenu(); // Close the menu on click

        axios
            .post(route("user.changeRole", conversation.id), {}, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then((res) => {
                emit("conversation.updated", {
                    id: conversation.id,
                    is_admin: !conversation.is_admin
                });
                emit("toast.show", res.data.message);
            })
            .catch(() => {
                emit("toast.show", "Failed to change user role");
            })
            .finally(() => {
                setTimeout(() => {
                    isChangingRole.current = false;
                }, 300);
            });
    };

    const onBlockUser = (e, closeMenu) => {
        if (e) e.preventDefault();
        if (isTogglingBlock.current || !conversation.is_user) return;

        isTogglingBlock.current = true;
        closeMenu(); // Close the menu on click

        axios
            .post(route("user.blockUnblock", conversation.id), {}, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then((res) => {
                emit("conversation.updated", {
                    id: conversation.id,
                    blocked_at: conversation.blocked_at ? null : new Date().toISOString()
                });
                emit("toast.show", res.data.message);
            })
            .catch(() => {
                emit("toast.show", "Failed to block/unblock user");
            })
            .finally(() => {
                setTimeout(() => {
                    isTogglingBlock.current = false;
                }, 300);
            });
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Menu as="div" className="relative inline-block text-left">
                {({ open, close }) => (
                    <>
                        <div>
                            <Menu.Button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/40">
                                <EllipsisVerticalIcon className="w-5 h-5" />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items static className="absolute right-0 w-48 mt-2 bg-gray-800 rounded-md shadow-lg z-50">
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                onClick={(e) => onBlockUser(e, close)}
                                                className={`${active ? "bg-black/30 text-white" : "text-gray-100"
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                {conversation.blocked_at ? (
                                                    <>
                                                        <LockOpenIcon className="w-5 h-5 mr-2" />
                                                        Unblock User
                                                    </>
                                                ) : (
                                                    <>
                                                        <LockClosedIcon className="w-5 h-5 mr-2" />
                                                        Block User
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={(e) => changeUserRole(e, close)}
                                                onKeyDown={(e) => e.key === 'Enter' && changeUserRole(e, close)}
                                                className={`${active ? "bg-black/30 text-white" : "text-gray-100"
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-pointer`}
                                            >
                                                {conversation.is_admin ? (
                                                    <>
                                                        <UserIcon className="w-5 h-5 mr-2" />
                                                        Make Normal User
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                                        Make Admin
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </div>
    );
}
