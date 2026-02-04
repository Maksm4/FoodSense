import { Card } from "../UI/Card";
import { Button } from "../UI/Button";
import type { KitchenRequest } from "../../api/kitchenService";

interface KitchenItemProps {
    kitchen: KitchenRequest;
    onClick: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function KitchenItem({ kitchen, onClick, onDelete }: KitchenItemProps) {
    return (
        <Card
            title={kitchen.name}
            subtitle={`${kitchen.users.length} member${kitchen.users.length !== 1 ? 's' : ''}`}
            onClick={() => onClick(kitchen.id)}
            action={
                <div className="flex items-center gap-2">
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