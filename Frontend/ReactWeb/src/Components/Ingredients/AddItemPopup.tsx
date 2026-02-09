import { useState, useEffect } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { productService, type ProductResponse } from "../../api/productService";
import { ingredientsService, type CreateProductItemRequest } from "../../api/ingredientsService";
import { Unit } from "./enums";

interface AddItemPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onAdded: () => void;
    kitchenId: string;
}

export default function AddItemPopup({ isOpen, onClose, onAdded, kitchenId }: AddItemPopupProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ProductResponse[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

    const [quantity, setQuantity] = useState(1);
    const [productSize, setProductSize] = useState(0);
    const [unit, setUnit] = useState("");

    const [price, setPrice] = useState(0);
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [expirationDate, setExpirationDate] = useState( () => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.length >= 1) {
                try {
                    const results = await productService.search(searchQuery);
                    setSearchResults(results);
                } catch (err) {
                    console.error("Search failed", err);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleSubmit = async () => {
        if (!selectedProduct) return;

        try {
            const payload: CreateProductItemRequest = {
                productId: selectedProduct.id,
                quantity: Number(quantity),
                price: Number(price),
                purchaseDate: purchaseDate,
                expirationDate: expirationDate,
                productSize: Number(productSize),
                unit: unit 
            };

            await ingredientsService.add(kitchenId, payload);
            
            // Reset Form
            setSearchQuery("");
            setSelectedProduct(null);
            setQuantity(1);
            setProductSize(0);
            setPrice(0);
            
            onAdded();
            onClose();
        } catch (error) {
            console.error("Failed to add item", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200 overflow-visible">
                
                <h2 className="text-xl font-bold mb-4">Add New Item</h2>

                {/* SEARCH */}
                {!selectedProduct ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search Product</label>
                            <Input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Type to search (e.g. Milk)..."
                                autoFocus
                            />
                        </div>

                        {searchResults.length > 0 && (
                            <ul className="border rounded-md divide-y max-h-60 overflow-y-auto">
                                {searchResults.map(p => (
                                    <li 
                                        key={p.id} 
                                        className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                                        onClick={() => {
                                            setSelectedProduct(p);
                                            setSearchResults([]);
                                        }}
                                    >
                                        <div>
                                            <div className="font-semibold">{p.name}</div>
                                            <div className="text-xs text-gray-500">{p.brand}</div>
                                        </div>
                                        <div className="text-xs bg-gray-100 px-2 py-1 rounded">{p.barCode}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {searchQuery.length > 1 && searchResults.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-2">No products found</div>
                        )}
                    </div>
                ) : (
                    
                    /* DETAILS FORM */
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <div>
                                <h3 className="font-bold text-blue-900">{selectedProduct.name}</h3>
                                <p className="text-xs text-blue-600">{selectedProduct.brand}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedProduct(null)}
                                className="text-xs text-blue-500 hover:text-blue-700 underline"
                            >
                                Change
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <div className="flex items-start gap-2">
                                {/* Quantity */}
                                <div className="w-1/4">
                                    <Input 
                                        type="number" 
                                        value={quantity} 
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        placeholder="Qty"
                                    />
                                    <span className="text-[10px] text-gray-400 pl-1">Count</span>
                                </div>

                                <div className=" pt-2 text-gray-400 font-bold">x</div>

                                {/* Size */}
                                <div className="w-1/3">
                                    <Input 
                                        type="number" 
                                        value={productSize} 
                                        onChange={(e) => setProductSize(Number(e.target.value))}
                                        placeholder="Size"
                                    />
                                    <span className="text-[10px] text-gray-400 pl-1">Capacity</span>
                                </div>

                                {/* Unit */}
                                <div className="flex-1">
                                    <select 
                                        className="w-full h-42px px-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                    >
                                        {Object.values(Unit).map(u => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                    <span className="text-[10px] text-gray-400 pl-1">Unit</span>
                                </div>
                            </div>
                            
                            <div className="text-xs text-gray-500 mt-1 text-right">
                                Total Inventory: <strong>{quantity * productSize} {unit}</strong>
                            </div>
                        </div>

                        {/* Price & Purchase Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Price (Total)" 
                                type="number" 
                                step="0.01"
                                value={price} 
                                onChange={(e) => setPrice(Number(e.target.value))} 
                            />
                            <Input 
                                label="Purchase Date" 
                                type="date" 
                                value={purchaseDate} 
                                onChange={(e) => setPurchaseDate(e.target.value)} 
                            />
                        </div>

                        <Input 
                            label="Expiration Date" 
                            type="date" 
                            value={expirationDate} 
                            onChange={(e) => setExpirationDate(e.target.value)} 
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                            <Button variant="primary" onClick={handleSubmit}>Add Item</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}