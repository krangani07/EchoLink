import { Menu, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useEventBus } from "@/Eventbus";

export default function UserOptionsDropdown({ conversation }) {
    const { emit } = useEventBus();
    // Use refs to track operation states instead of useState to avoid re-renders
    const isChangingRole = useRef(false);
    const isTogglingBlock = useRef(false);
    // Add state to track if menu should be shown
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const changeUserRole = (e) => {
        // Add event parameter and explicitly prevent default
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Prevent multiple attempts
        if (isChangingRole.current) return;
        
        if (!conversation.is_user) {
            return;
        }
        
        isChangingRole.current = true;
        
        // Close the menu first
        setIsMenuOpen(false);
        
        axios
            .post(route("user.changeRole", conversation.id), {}, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then((res) => {
                console.log('Role change response:', res);
                
                // Emit event to update conversation in parent component
                emit("conversation.updated", {
                    id: conversation.id,
                    is_admin: !conversation.is_admin
                });
                
                emit("toast.show", res.data.message);
            })
            .catch((err) => {
                console.error('Role change error:', err);
                emit("toast.show", "Failed to change user role");
            })
            .finally(() => {
                // Reset the state after a delay
                setTimeout(() => {
                    isChangingRole.current = false;
                }, 300);
            });
    };

    const onBlockUser = (e) => {
        // Add the event parameter and prevent default
        if (e) e.preventDefault();
        
        // Prevent multiple attempts
        if (isTogglingBlock.current) return;
        
        if (!conversation.is_user) {
            return;
        }
    
        isTogglingBlock.current = true;
    
        // Close the menu first
        setIsMenuOpen(false);
    
        // Log the request
        console.log('Sending block/unblock request for user:', conversation.id);
    
        axios
            .post(route("user.blockUnblock", conversation.id), {}, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then((res) => {
                console.log('Block/unblock response:', res);
                
                // Emit event to update conversation in parent component
                emit("conversation.updated", {
                    id: conversation.id,
                    blocked_at: conversation.blocked_at ? null : new Date().toISOString()
                });
                
                emit("toast.show", res.data.message);
            })
            .catch((err) => {
                console.error('Block/unblock error:', err);
                emit("toast.show", "Failed to block/unblock user");
            })
            .finally(() => {
                // Reset the state after a delay
                setTimeout(() => {
                    isTogglingBlock.current = false;
                }, 300);
            });
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Menu as="div" className="relative inline-block text-left">
                {({ open }) => {
                    // Update our state when the menu opens/closes
                    if (open !== isMenuOpen) {
                        setIsMenuOpen(open);
                    }
                    
                    return (
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
                                                    onClick={onBlockUser}
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
                                                    onClick={(e) => changeUserRole(e)}
                                                    onKeyDown={(e) => e.key === 'Enter' && changeUserRole(e)}
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
                    );
                }}
            </Menu>
        </div>
    );
}