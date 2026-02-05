import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kitchenService, type KitchenResponse } from "../../api/kitchenService";
import { PageContainer } from "../UI/PageContainer";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { Popup } from "../UI/Popup";
import KitchenList from "../Kitchen/KitchenList";

export default function KitchensPage() {
    const navigate = useNavigate();

    const [kitchens, setKitchens] = useState<KitchenResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newKitchenName, setNewKitchenName] = useState("");
    const [kitchenToDelete, setKitchenToDelete] = useState<string | null>(null);

    useEffect(() => {
        loadKitchens();
    }, []);

    const loadKitchens = async () => {
        try {
            setIsLoading(true);
            const data = await kitchenService.getAll();
            setKitchens(data);
        } catch (error) {
            console.error("Failed to load kitchens", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newKitchenName.trim()) return;
        try {
            const created = await kitchenService.create(newKitchenName);
            setKitchens([...kitchens, created]);
            setIsCreateOpen(false);
            setNewKitchenName("");
        } catch (error) {
            console.error("Failed to create kitchen", error);
        }
    };

    const handleDelete = async () => {
        if (!kitchenToDelete) return;
        try {
            await kitchenService.delete(kitchenToDelete);
            setKitchens(prev => prev.filter(k => k.id !== kitchenToDelete));
            setKitchenToDelete(null);
        } catch (error) {
            console.error("Failed to delete kitchen", error);
        }
    };

    const handleCardClick = (id: string) => {
        navigate(`/kitchens/${id}`);
    };

    return (
        <PageContainer>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Kitchens</h1>
                {kitchens.length > 0 && (
                    <Button onClick={() => setIsCreateOpen(true)}>+ Add New</Button>
                )}
            </div>

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Loading your spaces...</div>
            ) : (
                <KitchenList
                    kitchens={kitchens}
                    onItemClick={handleCardClick}
                    onItemDelete={setKitchenToDelete}
                    onCreateClick={() => setIsCreateOpen(true)}
                />
            )}

            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold mb-4">Create New Kitchen</h3>
                        <Input
                            label="Kitchen Name" 
                            value={newKitchenName} 
                            onChange={(e) => setNewKitchenName(e.target.value)}
                            placeholder="e.g. Home, Office, Summer House"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleCreate}>Create</Button>
                        </div>
                    </div>
                </div>
            )}

            <Popup
                isOpen={!!kitchenToDelete}
                title="Delete Kitchen?"
                message="Are you sure? This will permanently delete the kitchen and all ingredients inside it."
                variant="danger"
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setKitchenToDelete(null)}
            />
        </PageContainer>
    );
}