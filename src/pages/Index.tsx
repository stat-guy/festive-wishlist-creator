
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Snowflake, Gift, TreePine } from "lucide-react";

const Index = () => {
  const [name, setName] = useState("");
  const [wishlistItem, setWishlistItem] = useState("");
  const [wishlist, setWishlist] = useState<Array<{ key: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartConversation = async () => {
    if (!name.trim()) return;
    
    try {
      setIsLoading(true);
      await supabase.rpc('triggername', { name: name.trim() });
      // Additional ElevenLabs integration will go here
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!wishlistItem.trim()) return;
    
    try {
      setIsLoading(true);
      const itemKey = Date.now().toString();
      await supabase.rpc('triggeradditemtowishlist', {
        itemkey: itemKey,
        itemname: wishlistItem.trim()
      });
      
      setWishlist([...wishlist, { key: itemKey, name: wishlistItem }]);
      setWishlistItem("");
    } catch (error) {
      console.error('Error adding wishlist item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemKey: string) => {
    try {
      setIsLoading(true);
      await supabase.rpc('triggerremoveitemfromwishlist', { itemkey: itemKey });
      setWishlist(wishlist.filter(item => item.key !== itemKey));
    } catch (error) {
      console.error('Error removing wishlist item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center gap-4 mb-6">
            <TreePine className="text-green-600 w-8 h-8" />
            <Snowflake className="text-blue-400 w-8 h-8 animate-spin-slow" />
            <Gift className="text-red-600 w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-4">Santa's Interactive Wishlist</h1>
          <p className="text-xl text-gray-600">Share your Christmas wishes with Santa!</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              What's your name?
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Enter your name"
              />
              <button
                onClick={handleStartConversation}
                disabled={isLoading || !name.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Start Chat
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="wishlist" className="block text-sm font-medium text-gray-700 mb-2">
              Add to your wishlist
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                id="wishlist"
                value={wishlistItem}
                onChange={(e) => setWishlistItem(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Enter a wish"
              />
              <button
                onClick={handleAddToWishlist}
                disabled={isLoading || !wishlistItem.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Add Wish
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Wishlist:</h3>
            {wishlist.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between bg-white rounded-lg p-4 shadow"
              >
                <span className="text-gray-700">{item.name}</span>
                <button
                  onClick={() => handleRemoveFromWishlist(item.key)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            {wishlist.length === 0 && (
              <p className="text-gray-500 text-center italic">Your wishlist is empty</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
