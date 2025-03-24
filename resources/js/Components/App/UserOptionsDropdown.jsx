import { Button, Menu, MenuButton, MenuItem, MenuItems, Transition  } from "@headlessui/react";
import { Fragment } from "react";
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";

export default function UserOptionsDropdown({ conversation }) {

    const changeUserRole = () => {
        console.log("Change user role");
        if (!conversation.is_user) {
            return;
        }
        axios
            .post(route("user.changeRole",conversation.id))
            .then((res)=>{
                console.log(res.data);
            })
            .catch((err)=>{
                console.error(err);
            });

    };

    const onBlockUser = () => {
        console.log("Block user");
        if (!conversation.is_user) {
            return;
        }

        axios
            .post(route("user.blockUnblock", conversation.id))
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/40">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </MenuButton>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <MenuItems className="absolute right-0 w-48 mt-2 bg-gray-800 rounded-md shadow-lg z-50">
                        <div className="px-1 py-1">
                            <MenuItem as="button"
                                onClick={onBlockUser}
                                className={({ active }) =>
                                    `${active ? "bg-black/30 text-white" : "text-gray-100"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`
                                }>
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
                            </MenuItem>
                        </div>
                        <div className="px-1 py-1">
                            <MenuItem as="button"
                                onClick={changeUserRole}
                                className={({ active }) =>
                                    `${active ? "bg-black/30 text-white" : "text-gray-100"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`
                                }>
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
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>
        </div>
    );
}