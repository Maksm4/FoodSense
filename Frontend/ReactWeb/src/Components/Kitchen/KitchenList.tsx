import KitchenItem from "./KitchenItem";
import { Button } from "../UI/Button";
import type { KitchenResponse } from "../../api/kitchenService";

interface KitchenListProps {
    kitchens: KitchenResponse[];
    onItemClick: (id: string) => void;
    onItemDelete: (id: string) => void;
    onCreateClick: () => void;
}

export default function KitchenList({ kitchens, onItemClick, onItemDelete, onCreateClick }: KitchenListProps) {
    // 1. Empty State
    if (kitchens.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="mb-4 text-gray-300">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">You don't have a kitchen yet</h2>
                <p className="text-gray-500 mb-8 max-w-xs">Create your first shared space to start tracking ingredients.</p>
                <Button onClick={onCreateClick} className="px-8 py-3 text-lg">
                    Create Kitchen
                </Button>
            </div>
        );
    }

    // 2. List State
    return (
        <div className="space-y-4">
            {kitchens.map((kitchen) => (
                <KitchenItem 
                    key={kitchen.id}
                    kitchen={kitchen}
                    onClick={onItemClick}
                    onDelete={onItemDelete}
                />
            ))}
        </div>
    );
}