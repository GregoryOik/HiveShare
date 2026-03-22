import React, { useState } from 'react';
import { X, Trash2, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

export default function Membership() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartPlan, setCartPlan] = useState<{id: string, name: string, price: number, link: string} | null>(null);
  const [hasOliveOil, setHasOliveOil] = useState(false);
  const { profile, logout } = useAuth();

  const cartItemsCount = (cartPlan ? 1 : 0) + (hasOliveOil ? 1 : 0);
  const cartTotal = (cartPlan?.price || 0) + (hasOliveOil ? 18 : 0);

  return (
    <div className="min-h-screen bg-[#1A1208] text-white/80 font-body selection:bg-honey selection:text-white flex flex-col">
      <header className="border-b border-honey/20 bg-[#1A1208] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
          <Link to="/dashboard" className="font-display text-2xl tracking-wide text-white">
            Hive<span className="text-honey">Share</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted hover:text-honey transition-colors duration-200 hidden md:block">
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-honey/50"></div>
              <span className="text-[10px] uppercase tracking-widest text-white/50">{profile?.email}</span>
            </div>
            <button onClick={logout} className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-1">
              <LogOut className="w-3 h-3" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden">
        <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-light mb-6 text-center text-white">Choose Your Membership</h2>
          <p className="text-white/50 text-center max-w-md mx-auto mb-16 text-sm">
            Adopt your very own hive in Greece. Start tracking its data today, and receive authentic honey harvested by our master beekeeper.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-0">
            {/* Starter */}
            <div className="border border-honey/20 p-10 bg-[#110C05] md:border-r-0 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-widest text-white/50 mb-6">Starter</div>
              <div className="mb-2 flex items-start text-white">
                <span className="font-display text-[3rem] leading-none">80</span>
                <span className="text-xl font-medium mt-1 ml-1">€</span>
              </div>
              <div className="text-xs text-white/40 mb-10">per year <span className="text-honey font-medium ml-1">· less than €7/mo</span></div>
              
              <ul className="space-y-4 text-sm text-white/80 mb-12 flex-1">
                <li className="flex gap-3"><span className="text-honey">—</span> Welcome jar (250g)</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Dashboard access (basic metrics)</li>
                <li className="flex gap-3"><span className="text-honey">—</span> 3 seasonal harvests (~800g each, 2.5kg total)</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Standard label</li>
              </ul>
              
              <button 
                onClick={() => {
                  setCartPlan({ id: 'starter', name: 'Starter Membership', price: 80, link: 'https://buy.stripe.com/test_7sYdR9gYn4ZB9Io8aAdwc00' });
                  setIsCartOpen(true);
                }}
                className="block text-center w-full border border-honey/30 py-3 text-xs uppercase tracking-wider font-medium hover:bg-honey/10 transition-colors rounded-[2px]"
              >
                Select Starter
              </button>
            </div>
            
            {/* Premium */}
            <div className="border border-honey p-12 bg-[#1A1208] text-white relative z-10 shadow-[0_0_30px_rgba(200,134,10,0.15)] md:-my-3 rounded-[2px]">
              <div className="absolute top-0 right-0 bg-honey text-[#1A1208] text-[9px] uppercase tracking-widest px-3 py-1 font-bold rounded-bl-sm">Recommended</div>
              <div className="text-[10px] uppercase tracking-widest text-honey mb-6">Premium</div>
              <div className="mb-2 text-pale-honey flex items-start">
                <span className="font-display text-[3rem] leading-none text-honey">160</span>
                <span className="text-xl font-medium mt-1 ml-1 text-honey">€</span>
              </div>
              <div className="text-xs text-white/50 mb-10">per year <span className="text-honey font-medium ml-1">· less than €14/mo</span></div>
              
              <ul className="space-y-4 text-sm text-white/90 mb-12 flex-1">
                <li className="flex gap-3"><span className="text-honey">—</span> Welcome jar (1kg) shipped immediately</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Dashboard access (full metrics + acoustic data)</li>
                <li className="flex gap-3"><span className="text-honey">—</span> 3 seasonal harvests (~1.3kg each, 5kg total)</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Named jar (your name on the label)</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Digital Certificate of Adoption</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Handwritten note from Petros with each harvest</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Priority shipping & exclusive variety access</li>
              </ul>
              
              <button 
                onClick={() => {
                  setCartPlan({ id: 'premium', name: 'Premium Membership', price: 160, link: 'https://buy.stripe.com/test_9B6dR9azZdw79Io0I8dwc01' });
                  setIsCartOpen(true);
                }}
                className="block text-center w-full bg-honey text-white py-4 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors rounded-[2px]"
              >
                Select Premium
              </button>
            </div>
            
            {/* Corporate */}
            <div className="border border-honey/20 p-10 bg-[#110C05] md:border-l-0 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-widest text-white/50 mb-6">Corporate</div>
              <div className="mb-2 flex items-start text-white">
                <span className="font-display text-[3rem] leading-none">1,800</span>
                <span className="text-xl font-medium mt-1 ml-1">€</span>
              </div>
              <div className="text-xs text-white/40 mb-10">per year</div>
              
              <ul className="space-y-4 text-sm text-white/80 mb-12 flex-1">
                <li className="flex gap-3"><span className="text-honey">—</span> Block of 15 dedicated hives</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Custom branded dashboard</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Custom branded honey jars</li>
                <li className="flex gap-3"><span className="text-honey">—</span> Corporate gifting fulfillment</li>
              </ul>
              
              <a 
                href="mailto:info@oikonomakos.gr"
                className="block text-center w-full border border-honey/30 py-3 text-xs uppercase tracking-wider font-medium hover:bg-honey/10 transition-colors rounded-[2px]"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Olive Oil Add-on */}
          <div className="mt-16 border border-honey/20 p-8 bg-[#110C05] rounded-[2px] max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_15px_rgba(200,134,10,0.05)]">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-honey font-bold mb-2">Annual Add-on</div>
              <h3 className="font-display text-2xl mb-2 text-white">Laconian Olive Oil · 500ml</h3>
              <p className="text-sm text-white/60 mb-1">Single-estate, cold-pressed, harvest 2026</p>
              <p className="text-sm text-white/50">Added to your autumn shipment</p>
            </div>
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
              <div className="font-display text-3xl text-honey mb-3">18 €</div>
              <button 
                onClick={() => {
                  setHasOliveOil(true);
                  setIsCartOpen(true);
                }}
                disabled={hasOliveOil || !cartPlan}
                className="px-8 py-3 bg-honey/20 text-honey border border-honey/50 text-[10px] uppercase tracking-widest font-medium hover:bg-honey hover:text-white transition-colors rounded-[2px] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {!cartPlan ? 'Select a plan first' : hasOliveOil ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex justify-end" onClick={() => setIsCartOpen(false)}>
          <div className="w-full max-w-md bg-[#110C05] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-honey/20" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-honey/20 flex justify-between items-center bg-[#1A1208]">
              <h2 className="font-display text-2xl text-white">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItemsCount === 0 ? (
                <p className="text-white/40 text-center mt-10">Your cart is empty.</p>
              ) : (
                <>
                  {cartPlan && (
                    <div className="flex justify-between items-center border-b border-honey/10 pb-6">
                      <div>
                        <div className="font-medium text-white/90 mb-1 text-lg">{cartPlan.name}</div>
                        <div className="text-xs text-honey/70">Annual Subscription</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="font-display text-2xl text-honey">{cartPlan.price} €</div>
                        <button onClick={() => setCartPlan(null)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  )}
                  {hasOliveOil && (
                    <div className="flex justify-between items-center border-b border-honey/10 pb-6">
                      <div>
                        <div className="font-medium text-white/90 mb-1 text-lg">Laconian Olive Oil</div>
                        <div className="text-xs text-honey/70">500ml · Annual Add-on</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="font-display text-2xl text-honey">18 €</div>
                        <button onClick={() => setHasOliveOil(false)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  )}
                  {!hasOliveOil && cartPlan && (
                    <div className="mt-4 p-5 rounded-[2px] bg-honey/5 border border-honey/20 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-white mb-1">Add Laconian Olive Oil?</p>
                          <p className="text-xs text-white/50">500ml Single-estate, cold-pressed</p>
                        </div>
                        <span className="font-display text-xl text-honey">18 €</span>
                      </div>
                      <button 
                        onClick={() => setHasOliveOil(true)}
                        className="w-full py-2.5 mt-2 bg-honey/20 text-honey border border-honey/30 text-[10px] uppercase tracking-widest font-medium hover:bg-honey hover:text-white transition-colors rounded-[2px]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {cartItemsCount > 0 && (
              <div className="p-8 border-t border-honey/20 bg-[#1A1208]">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm uppercase tracking-widest text-white/50">Total</span>
                  <span className="font-display text-4xl text-white">{cartTotal} €</span>
                </div>
                {cartPlan ? (
                  <a 
                    href={cartPlan.link}
                    className="block text-center w-full bg-honey text-white py-4 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors rounded-[2px] shadow-[0_0_20px_rgba(200,134,10,0.3)] hover:shadow-[0_0_30px_rgba(200,134,10,0.5)]"
                  >
                    Proceed to Checkout
                  </a>
                ) : (
                  <button 
                    disabled
                    className="block text-center w-full bg-white/5 text-white/30 py-4 text-xs uppercase tracking-wider font-medium cursor-not-allowed rounded-[2px]"
                  >
                    Select a plan to checkout
                  </button>
                )}
                <p className="text-[10px] text-white/30 text-center mt-4 uppercase tracking-widest leading-relaxed">
                  {hasOliveOil && cartPlan ? "Note: Olive oil (€18) will be invoiced separately via email after your membership is confirmed." : ""}
                  {!cartPlan && hasOliveOil ? "Please select a membership plan to checkout with add-ons." : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
