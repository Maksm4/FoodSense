import { useState } from "react";
import { Card } from "../UI/Card";
import { Button } from "../UI/Button";
import { kitchenService, type KitchenResponse } from "../../api/kitchenService";

interface KitchenItemProps {
    kitchen: KitchenResponse;
    onClick: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function KitchenItem({ kitchen, onClick, onDelete }: KitchenItemProps) {
    const [isSharing, setIsSharing] = useState(false);

    const handleShareKitchen = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSharing) return;

        try {
            setIsSharing(true);
            const data = await kitchenService.generateInviteLink(kitchen.id);
            const fullLink = `${window.location.origin}/join/${data.inviteCode}`;
            
            await navigator.clipboard.writeText(fullLink);
        } catch {
            alert("Failed to generate invite link");
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <Card
            title={kitchen.name}
            subtitle={`${kitchen.users.length} member${kitchen.users.length !== 1 ? 's' : ''}`}
            onClick={() => onClick(kitchen.id)}
            action={
                <div className="flex items-center gap-2">
                    {/* Share Button */}
                    <Button 
                        onClick={handleShareKitchen}
                        className="py-1 px-3 text-xs bg-primary text-white"
                        disabled={isSharing}
                    >
                        {isSharing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-share-nodes"></i>}
                        <span className="ml-2">Copy Share Link</span>
                    </Button>
                    <Button 
                        variant="danger" 
                        className="py-1 px-3 text-xs"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(kitchen.id);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            }
        />
    );
}