import {
    Menu,
    Transition,
} from "@headlessui/react";
import { Fragment, useRef } from "react";
import {
    EllipsisVerticalIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useEventBus } from "../../EventBus";
import PreviousMap_ from "postcss/lib/previous-map";

export default function MessageOptionsDropdown({ message }) {
    const { emit } = useEventBus();
    // Use a ref to track deletion state instead of useState to avoid re-renders
    const isDeleting = useRef(false);

    const onMessageDelete = () => {
        // Prevent multiple delete attempts
        if (isDeleting.current) return;
        
        isDeleting.current = true;
        
        axios
            .delete(route('message.destroy', message.id))
            .then((res) => {
                // Emit just the message ID, not an object
                console.log("Message deleted, emitting event with ID:", message.id);
                emit("messageDeleted", message.id);
            })
            .catch((err) => {
                console.error("Error deleting message:", err);
            })
            .finally(() => {
                // Reset the deleting state after a delay
                setTimeout(() => {
                    isDeleting.current = false;
                }, 300);
            });
    };

    return (
        <div className="absolute right-full text-gray-100 top-1/2 -translate-y-1/2 z-10">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/40">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </Menu.Button>
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
                    <Menu.Items className="absolute left-0 w-48 mt-2 bg-gray-800 rounded-md shadow-lg z-50">
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={`${
                                            active
                                                ? "bg-black/30 text-white"
                                                : "text-gray-100"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
