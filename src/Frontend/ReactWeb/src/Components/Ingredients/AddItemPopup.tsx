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
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const [quantity, setQuantity] = useState(1);
    const [productSize, setProductSize] = useState(0);
    const [unit, setUnit] = useState<string>(Unit.Pcs);

    const [price, setPrice] = useState(0);
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [expirationDate, setExpirationDate] = useState(
        () => new Date(Date.now() + 86400000).toISOString().split('T')[0]
    );

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
        }, 700);

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

    const handleImageError = (productId: string) => {
        setImageErrors(prev => new Set(prev).add(productId));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">

                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <i className="fa-solid fa-plus text-primary"></i>
                    Add New Item
                </h2>

                {/* SEARCH */}
                {!selectedProduct ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search Product
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Type to search (e.g. Mleko, Jogurt)..."
                                    autoFocus
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <ul className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-72 overflow-y-auto shadow-lg">
                                {searchResults.map(p => (
                                    <li
                                        key={p.id}
                                        className="flex items-center gap-3 p-3 hover:bg-selection-bg cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                                        onClick={() => {
                                            setSelectedProduct(p);
                                            setSearchResults([]);
                                        }}
                                    >
                                        {/* Product Image */}
                                        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                                            {p.imageUrl && !imageErrors.has(p.id) ? (
                                                <img
                                                    src={p.imageUrl}
                                                    alt={p.name}
                                                    className="w-full h-full object-contain p-1"
                                                    onError={() => handleImageError(p.id)}
                                                />
                                            ) : (
                                                <i className="fa-solid fa-box text-gray-300 text-lg"></i>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-800 truncate">
                                                {p.name}
                                            </div>
                                            <div className="text-xs text-gray-500">{p.brand}</div>
                                        </div>

                                        {/* Barcode */}
                                        <div className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg shrink-0 hidden sm:block">
                                            {p.barCode}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {searchQuery.length > 1 && searchResults.length === 0 && (
                            <div className="text-sm text-gray-400 text-center py-4 flex flex-col items-center gap-2">
                                <i className="fa-solid fa-box-open text-2xl"></i>
                                No products found
                            </div>
                        )}
                    </div>
                ) : (

                    /* DETAILS FORM */
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-selection-bg p-3 rounded-xl border border-primary/20">
                            <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-white border border-primary/20 flex items-center justify-center">
                                {selectedProduct.imageUrl && !imageErrors.has(selectedProduct.id) ? (
                                    <img
                                        src={selectedProduct.imageUrl}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-contain p-1"
                                        onError={() => handleImageError(selectedProduct.id)}
                                    />
                                ) : (
                                    <i className="fa-solid fa-box text-primary/30 text-xl"></i>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 truncate">
                                    {selectedProduct.name}
                                </h3>
                                <p className="text-xs text-gray-500">{selectedProduct.brand}</p>
                            </div>

                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="shrink-0 text-xs text-primary hover:text-primary-hover font-semibold underline"
                            >
                                Change
                            </button>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <div className="flex items-start gap-2">
                                <div className="w-1/4">
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        placeholder="Qty"
                                    />
                                    <span className="text-[10px] text-gray-400 pl-1">Count</span>
                                </div>

                                <div className="pt-2 text-gray-400 font-bold">x</div>

                                <div className="w-1/3">
                                    <Input
                                        type="number"
                                        value={productSize}
                                        onChange={(e) => setProductSize(Number(e.target.value))}
                                        placeholder="Size"
                                    />
                                    <span className="text-[10px] text-gray-400 pl-1">Capacity</span>
                                </div>

                                <div className="flex-1">
                                    <select
                                        className="w-full h-42px px-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none text-sm"
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