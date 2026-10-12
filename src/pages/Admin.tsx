import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  Users,
  DollarSign,
  ArrowLeft,
  Search,
  Plus,
  LogOut,
  Lock,
  ChevronRight,
  ShieldAlert,
  CheckCircle,
  MapPin,
  Activity,
  Calendar,
  StickyNote,
  ShoppingBag,
  Truck,
  Copy,
  Check,
  Edit2,
  ExternalLink,
  Download,
  Filter,
  Phone,
  Mail,
  Gift,
  Compass,
  AlertTriangle,
  RefreshCw,
  X,
  Package,
  FileSpreadsheet,
  Eye,
  KeyRound,
  Printer,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { useHiveData, useSiteConfig } from '../lib/useHiveData';
import { useAdminUsers, UserProfile, JarOrder } from '../lib/useAdminUsers';
import { sendEmail, emailTemplates } from '../lib/email';
import PackingSlipModal, { PackingSlipData } from '../components/PackingSlipModal';
import Footer from '../components/Footer';

// Modular Sub-Components
import { AdminHiveGrid } from '../components/admin/AdminHiveGrid';
import { AdminHiveDetails } from '../components/admin/AdminHiveDetails';
import { AdminFinance } from '../components/admin/AdminFinance';

export default function Admin() {
  const { user: authUser, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { hives, loading: hivesLoading, addHive, updateHive, removeHive, pushHivePulse, seedHiveHistory, addJournalEntry } = useHiveData();
  const { config, updateConfig } = useSiteConfig();
  const {
    users,
    jarOrders,
    loading: usersLoading,
    updateUser,
    assignHiveToUser,
    removeHiveFromUser,
    batchUpdateUsers,
    deleteUser,
    updateJarOrder,
    deleteJarOrder
  } = useAdminUsers();

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'crm' | 'orders' | 'hives' | 'finance'>('crm');
  const [searchTerm, setSearchTerm] = useState('');
  const [crmFilter, setCrmFilter] = useState<'all' | 'needs_shipment' | 'premium' | 'starter' | 'missing_address'>('all');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'packed' | 'shipped'>('all');

  // Selected State
  const [selectedHiveId, setSelectedHiveId] = useState<string | null>(null);
  const [isAddingHive, setIsAddingHive] = useState(false);
  const [editingClient, setEditingClient] = useState<UserProfile | null>(null);
  const [editingOrder, setEditingOrder] = useState<JarOrder | null>(null);
  const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null);

  // Email Notification & Composer State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [emailModalData, setEmailModalData] = useState<{
    to: string;
    name: string;
    subject: string;
    message: string;
    preset: 'shipping' | 'welcome' | 'custom';
  } | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Courier Packing Slip State
  const [packingSlipData, setPackingSlipData] = useState<PackingSlipData | null>(null);

  // 1-Click WhatsApp Client Outreach
  const openWhatsAppOutreach = (phone?: string, name?: string, ref?: string) => {
    if (!phone) {
      alert("No contact phone recorded for this client. Please enter one in 'Edit Profile'.");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${name || 'Guardian'}, this is Gregory from Petros Oikonomakos Apiaries (HiveShare). We are preparing your honey shipment ${ref ? `[${ref}]` : ''} and wanted to confirm your delivery coordinates.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Master Access Gate for Gregory
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Check if session has admin unlock or if auth profile is already admin
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('hs_admin_master_unlocked');
    if (sessionAuth === 'true' || profile?.role === 'admin' || authUser?.email === 'gregorygate46@gmail.com') {
      setIsUnlocked(true);
    }
  }, [profile, authUser]);

  const handleMasterUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (cleanPass === 'gregory2026' || cleanPass === 'oikonomakos1996' || cleanPass === 'admin' || cleanPass === 'hiveshare') {
      setIsUnlocked(true);
      sessionStorage.setItem('hs_admin_master_unlocked', 'true');
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  // Copy address formatted for courier label printers
  const handleCopyAddress = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddressId(id);
    setTimeout(() => setCopiedAddressId(null), 2500);
  };

  // Export full shipping manifest as CSV for ELTA Courier / DHL / UPS
  const handleExportCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'Street Address', 'City', 'Postal Code', 'Country', 'Tier', 'Assigned Hive', 'Custom Label', 'Status', 'Notes'];
    const rows = users.map(u => [
      `"${u.fullName || u.customLabel || 'Guardian'}"`,
      `"${u.email}"`,
      `"${u.phone || ''}"`,
      `"${u.shippingAddress || ''}"`,
      `"${u.city || ''}"`,
      `"${u.postalCode || ''}"`,
      `"${u.country || ''}"`,
      `"${u.tier || 'None'}"`,
      `"${(u.subscribedHives || []).join(', ')}"`,
      `"${u.customHoneyName || ''}"`,
      `"${u.userHarvestStatus || 'PENDING'}"`,
      `"${(u.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hiveshare_shipping_manifest_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Clients
  const filteredClients = users.filter(u => {
    const matchesSearch =
      (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.shippingAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.country || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.subscribedHives || []).some(h => h.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (crmFilter === 'needs_shipment') return u.userHarvestStatus === 'PENDING' || u.userHarvestStatus === 'PACKED';
    if (crmFilter === 'premium') return u.tier === 'premium';
    if (crmFilter === 'starter') return u.tier === 'starter';
    if (crmFilter === 'missing_address') return !u.shippingAddress || u.shippingAddress.trim() === '';
    return true;
  });

  // Filtered Jar Orders
  const filteredJarOrders = jarOrders.filter(o => {
    const matchesSearch =
      o.orderRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.variety.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (orderFilter === 'pending') return o.status === 'pending';
    if (orderFilter === 'packed') return o.status === 'packed';
    if (orderFilter === 'shipped') return o.status === 'shipped';
    return true;
  });

  const selectedHive = hives.find(h => h.id === selectedHiveId);

  // Metric aggregates
  const totalGuardians = users.filter(u => u.tier === 'starter' || u.tier === 'premium').length;
  const totalPremium = users.filter(u => u.tier === 'premium').length;
  const totalStarter = users.filter(u => u.tier === 'starter').length;
  const pendingShipments = users.filter(u => u.userHarvestStatus === 'PENDING').length + jarOrders.filter(o => o.status === 'pending').length;
  const totalRevenue = (totalStarter * 140) + (totalPremium * 340) + jarOrders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);

  // ─── MASTER ACCESS GATE ──────────────────────────────────────────────────────
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0E0A06] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,134,10,0.08)_0%,_transparent_70%)] pointer-events-none" />
        <div className="relative z-10 w-full max-w-md bg-[#16100A] border border-honey/30 p-8 md:p-10 rounded-[2px] shadow-[0_0_80px_rgba(200,134,10,0.15)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-honey/10 border border-honey/40 rounded-full flex items-center justify-center mx-auto text-honey">
              <KeyRound size={26} />
            </div>
            <h2 className="font-display text-3xl text-white">Central Station Access</h2>
            <p className="text-xs text-honey/70 uppercase tracking-widest font-bold">
              HiveShare Fleet Command & Client CRM
            </p>
          </div>

          <p className="text-xs text-white/60 text-center leading-relaxed font-light">
            Welcome, Gregory. Enter your master administrator key to access all client shipping addresses, harvest dispatching, and live apiary telemetry.
          </p>

          <form onSubmit={handleMasterUnlock} className="space-y-4">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1.5">
                Master Passcode
              </label>
              <input
                type="password"
                autoFocus
                value={passcode}
                onChange={e => { setPasscode(e.target.value); setPasscodeError(false); }}
                placeholder="Enter admin passcode"
                className="w-full bg-black/60 border border-honey/40 px-4 py-3 text-sm text-white rounded-[2px] focus:outline-none focus:border-honey font-mono tracking-widest"
              />
              {passcodeError && (
                <div className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle size={11} /> Invalid passcode. Try "gregory2026" or "admin".
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-honey text-[#0E0A06] font-bold text-xs uppercase tracking-[0.2em] rounded-[2px] hover:bg-honey/90 transition-all shadow-[0_0_20px_rgba(200,134,10,0.3)] active:scale-95"
            >
              Unlock Central Station
            </button>
          </form>

          <div className="pt-2 border-t border-honey/15 flex items-center justify-between text-[9px] uppercase tracking-widest text-white/40 font-bold">
            <Link to="/" className="hover:text-honey transition-colors">← Back to Site</Link>
            <Link to="/login" className="hover:text-honey transition-colors">Sign in with Email →</Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN ADMIN INTERFACE ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0C0804] text-white font-sans selection:bg-honey selection:text-black flex flex-col">
      {/* Background ambient texture */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#C8860A 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      </div>

      {/* ── Top Protocol Bar ── */}
      <header className="border-b border-honey/15 bg-[#0C0804]/90 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="max-w-[1700px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-honey rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(200,134,10,0.4)]">
                <Zap size={20} className="text-[#0C0804]" fill="currentColor" />
              </div>
              <div>
                <h1 className="font-display text-2xl tracking-tight text-white leading-none">CENTRAL_STATION</h1>
                <p className="text-[8px] tracking-[0.35em] font-black text-honey uppercase mt-1">Client CRM & Fleet Dispatch</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-honey/15">
              <button
                onClick={() => { if (config) updateConfig({ maintenanceMode: !config.maintenanceMode }); }}
                className={`px-3 py-1 border text-[8px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 ${
                  config?.maintenanceMode
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-green-500/10 border-green-500/40 text-green-400'
                }`}
              >
                <Lock size={10} /> {config?.maintenanceMode ? 'SYSTEM: MAINTENANCE' : 'SYSTEM: ONLINE'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-mono text-white/50 uppercase tracking-wider">
            <div className="hidden md:flex items-center gap-4">
              <span className="text-honey font-bold">€{totalRevenue.toLocaleString()} EST. REV</span>
              <span>·</span>
              <span>{totalGuardians} ACTIVE GUARDIANS</span>
              <span>·</span>
              <span className="text-orange-400 font-bold">{pendingShipments} SHIPMENTS PENDING</span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-honey">{authUser?.email || 'gregory@hiveshare'}</span>
            <button
              onClick={() => {
                sessionStorage.removeItem('hs_admin_master_unlocked');
                setIsUnlocked(false);
              }}
              title="Lock Admin Station"
              className="hover:text-red-400 transition-colors p-1"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="max-w-[1700px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between border-t border-honey/10">
          <nav className="flex items-center gap-2">
            {[
              { id: 'crm', icon: Users, label: 'Clients & Address CRM', badge: users.length },
              { id: 'orders', icon: ShoppingBag, label: 'Jar Orders & Shipments', badge: jarOrders.length },
              { id: 'hives', icon: Zap, label: 'Apiary Fleet', badge: hives.length },
              { id: 'finance', icon: DollarSign, label: 'Financial Health' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${
                  activeTab === tab.id
                    ? 'bg-honey text-[#0C0804] shadow-[0_0_20px_rgba(200,134,10,0.3)]'
                    : 'text-honey/60 hover:text-honey hover:bg-honey/10'
                }`}
              >
                <tab.icon size={13} /> {tab.label}
                {tab.badge !== undefined && (
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-[#0C0804] text-honey' : 'bg-honey/20 text-honey'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {activeTab === 'crm' && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-honey/15 border border-honey/30 hover:bg-honey hover:text-[#0C0804] text-honey text-[9px] uppercase tracking-widest font-black transition-all rounded-full"
              >
                <Download size={11} /> Export CSV Manifest
              </button>
            )}
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-honey hover:border-honey/30 transition-all rounded-full"
            >
              <ArrowLeft size={11} /> Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ── */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-6 md:p-10 relative z-10 space-y-8">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: CLIENTS & ADDRESS CRM                                        */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            {/* Top Stat Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#140E08] border border-honey/20 p-5 rounded-[2px]">
                <div className="text-[9px] uppercase tracking-widest text-honey/70 font-bold mb-1">Total Registered Clients</div>
                <div className="font-display text-3xl text-white">{users.length}</div>
                <div className="text-[9px] text-white/40 mt-1">Guardians + Observers</div>
              </div>
              <div className="bg-[#140E08] border border-honey/20 p-5 rounded-[2px]">
                <div className="text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Premium Patrons (€340/yr)</div>
                <div className="font-display text-3xl text-honey">{totalPremium}</div>
                <div className="text-[9px] text-white/40 mt-1">5kg allocations · Named Hives</div>
              </div>
              <div className="bg-[#140E08] border border-honey/20 p-5 rounded-[2px]">
                <div className="text-[9px] uppercase tracking-widest text-honey/70 font-bold mb-1">Starter Guardians (€140/yr)</div>
                <div className="font-display text-3xl text-white">{totalStarter}</div>
                <div className="text-[9px] text-white/40 mt-1">2.5kg seasonal allocations</div>
              </div>
              <div className="bg-[#140E08] border border-orange-500/30 p-5 rounded-[2px] bg-orange-950/10">
                <div className="text-[9px] uppercase tracking-widest text-orange-400 font-bold mb-1">Action Required</div>
                <div className="font-display text-3xl text-orange-400">{pendingShipments}</div>
                <div className="text-[9px] text-orange-300/50 mt-1">Shipments pending packing/dispatch</div>
              </div>
            </div>

            {/* Controls Bar: Search & Quick Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#140E08] border border-honey/20 p-4 rounded-[2px]">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey/50" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search clients by name, email, city, street address, or hive #..."
                  className="w-full bg-black/60 border border-honey/20 pl-10 pr-4 py-2.5 text-xs text-white rounded-[2px] focus:outline-none focus:border-honey"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'All Clients' },
                  { id: 'needs_shipment', label: 'Needs Shipment' },
                  { id: 'premium', label: 'Premium Patrons' },
                  { id: 'starter', label: 'Starter' },
                  { id: 'missing_address', label: 'Missing Address' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setCrmFilter(f.id as any)}
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold rounded-[2px] transition-all whitespace-nowrap border ${
                      crmFilter === f.id
                        ? 'bg-honey text-[#0C0804] border-honey shadow-sm'
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-honey/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clients Directory Table */}
            <div className="bg-[#140E08] border border-honey/20 rounded-[2px] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-honey/20 bg-black/60 text-[9px] uppercase tracking-widest text-honey/70 font-mono">
                      <th className="py-4 px-6">Client / Guardian</th>
                      <th className="py-4 px-6">Complete Shipping Destination</th>
                      <th className="py-4 px-6">Tier & Allocation</th>
                      <th className="py-4 px-6">Assigned Hive</th>
                      <th className="py-4 px-6">Dispatch Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-honey/10">
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-white/40">
                          No clients match the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map(client => {
                        const fullAddressString = [
                          client.shippingAddress,
                          client.city,
                          client.postalCode,
                          client.country
                        ].filter(Boolean).join(', ');

                        return (
                          <tr key={client.uid} className="hover:bg-honey/5 transition-colors group">
                            {/* Client Contact Info */}
                            <td className="py-4 px-6">
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-honey/15 border border-honey/30 flex items-center justify-center font-bold text-honey text-sm shrink-0">
                                  {(client.fullName || client.email)[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-sm">
                                    {client.fullName || client.customLabel || 'Guardian'}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[11px] text-honey/80 font-mono">
                                    <Mail size={10} />
                                    <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                                  </div>
                                  {client.phone && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono mt-0.5">
                                      <Phone size={9} />
                                      <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
                                    </div>
                                  )}
                                  {client.adminNotes && (
                                    <div className="text-[10px] text-yellow-500/80 italic mt-1 bg-yellow-500/10 px-2 py-0.5 rounded-sm inline-block">
                                      Note: {client.adminNotes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Complete Shipping Destination */}
                            <td className="py-4 px-6 max-w-xs">
                              {fullAddressString ? (
                                <div className="space-y-1">
                                  <div className="text-white font-medium flex items-start gap-1.5">
                                    <MapPin size={12} className="text-honey shrink-0 mt-0.5" />
                                    <span>{client.shippingAddress}</span>
                                  </div>
                                  <div className="text-[11px] text-white/60 pl-4 font-mono">
                                    {[client.city, client.postalCode, client.country].filter(Boolean).join(' · ')}
                                  </div>
                                  <button
                                    onClick={() => handleCopyAddress(client.uid, `${client.fullName || client.email}\n${fullAddressString}\nPhone: ${client.phone || 'N/A'}`)}
                                    className="text-[9px] uppercase tracking-wider font-bold text-honey/70 hover:text-honey flex items-center gap-1 pl-4 pt-1 transition-colors"
                                  >
                                    {copiedAddressId === client.uid ? (
                                      <><Check size={10} className="text-green-400" /> Copied Address Label!</>
                                    ) : (
                                      <><Copy size={10} /> Copy Shipping Label</>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <div className="text-orange-400/80 text-[11px] flex items-center gap-1 italic">
                                  <AlertTriangle size={12} /> No shipping address on file
                                </div>
                              )}
                            </td>

                            {/* Tier & Allocation */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm border ${
                                client.tier === 'premium'
                                  ? 'bg-honey text-[#0C0804] border-honey shadow-sm'
                                  : client.tier === 'starter'
                                  ? 'bg-honey/15 text-honey border-honey/30'
                                  : 'bg-white/5 text-white/40 border-white/10'
                              }`}>
                                {client.tier === 'premium' ? 'Premium Patron · 5kg' : client.tier === 'starter' ? 'Starter · 2.5kg' : 'Observer (None)'}
                              </span>
                              {client.customHoneyName && (
                                <div className="text-[10px] text-honey/90 italic mt-1 font-serif">
                                  Jar: "{client.customHoneyName}"
                                </div>
                              )}
                            </td>

                            {/* Assigned Hive */}
                            <td className="py-4 px-6 whitespace-nowrap font-mono">
                              {(client.subscribedHives && client.subscribedHives.length > 0) ? (
                                <div className="flex flex-wrap gap-1">
                                  {client.subscribedHives.map(hiveId => (
                                    <span key={hiveId} className="px-2 py-0.5 bg-honey/10 border border-honey/30 text-honey rounded-sm text-[10px]">
                                      {hiveId}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-white/30 text-[10px]">Unassigned</span>
                              )}
                            </td>

                            {/* Dispatch Status */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              <select
                                value={client.userHarvestStatus || 'PENDING'}
                                onChange={async e => {
                                  const newStatus = e.target.value as any;
                                  await updateUser(client.uid, { userHarvestStatus: newStatus });
                                  if (['PACKED', 'DISPATCHED', 'DELIVERED'].includes(newStatus)) {
                                    await sendEmail(emailTemplates.harvestStatusUpdated(
                                      client.email,
                                      client.fullName || 'Guardian',
                                      newStatus,
                                      client.trackingNumber,
                                      client.courierNotes || 'Express Courier'
                                    ));
                                    showToast(`✓ Harvest status set to ${newStatus} · Notification sent to ${client.email}`);
                                  } else {
                                    showToast(`✓ Harvest status set to ${newStatus}`);
                                  }
                                }}
                                className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1.5 rounded-sm border outline-none bg-black/70 cursor-pointer ${
                                  client.userHarvestStatus === 'DELIVERED'
                                    ? 'text-green-400 border-green-500/40'
                                    : client.userHarvestStatus === 'DISPATCHED'
                                    ? 'text-purple-400 border-purple-500/40'
                                    : client.userHarvestStatus === 'PACKED'
                                    ? 'text-blue-400 border-blue-500/40'
                                    : 'text-orange-400 border-orange-500/40'
                                }`}
                              >
                                <option value="PENDING">PENDING HARVEST</option>
                                <option value="PACKED">PACKED IN GLASS</option>
                                <option value="DISPATCHED">DISPATCHED / SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                              </select>
                              {client.trackingNumber && (
                                <div className="text-[10px] text-white/50 font-mono mt-1">
                                  Track: {client.trackingNumber}
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setPackingSlipData({
                                    orderRef: `HS-HARVEST-${client.subscribedHives?.[0] || '2026'}`,
                                    orderDate: new Date().toLocaleDateString('en-GB'),
                                    customerName: client.fullName || client.email,
                                    customerEmail: client.email,
                                    customerPhone: client.phone,
                                    shippingAddress: client.shippingAddress || 'Address on file',
                                    city: client.city,
                                    postalCode: client.postalCode,
                                    country: client.country || 'Greece',
                                    trackingNumber: client.trackingNumber,
                                    carrier: client.carrier || 'Express European Courier',
                                    items: [
                                      {
                                        description: `${client.subscriptionTier === 'premium' ? 'Premium Patron' : 'Starter'} Seasonal Harvest Allocation`,
                                        quantity: client.subscriptionTier === 'premium' ? 2 : 1,
                                        size: client.subscriptionTier === 'premium' ? '5.0 kg Reserve' : '2.5 kg Reserve',
                                        customLabel: client.customHoneyName || client.customLabel,
                                      }
                                    ]
                                  })}
                                  className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[9px] uppercase tracking-widest font-bold rounded-sm transition-all border border-white/15 flex items-center gap-1"
                                  title="Print Courier Packing Slip"
                                >
                                  <Printer size={11} /> Slip
                                </button>
                                <button
                                  onClick={() => openWhatsAppOutreach(client.phone, client.fullName, `Colony #${client.subscribedHives?.[0] || '04'}`)}
                                  className="px-2 py-1.5 bg-green-500/10 hover:bg-green-500 hover:text-black text-green-400 text-[9px] uppercase tracking-widest font-bold rounded-sm transition-all border border-green-500/30 flex items-center gap-1"
                                  title="1-Click WhatsApp Outreach"
                                >
                                  <MessageSquare size={11} /> WA
                                </button>
                                <button
                                  onClick={() => setEmailModalData({
                                    to: client.email,
                                    name: client.fullName || 'Guardian',
                                    subject: `Update regarding your HiveShare Guardianship (${client.subscriptionTier || 'Starter'})`,
                                    message: `Dear ${client.fullName || 'Guardian'},\n\nWe are preparing the seasonal harvest from your designated colony in Mani.\n\nWarm regards,\nPetros & Gregory Oikonomakos`,
                                    preset: 'custom'
                                  })}
                                  className="px-2.5 py-1.5 bg-honey/10 hover:bg-honey hover:text-[#0C0804] text-honey text-[9px] uppercase tracking-widest font-bold rounded-sm transition-all border border-honey/30 flex items-center gap-1"
                                  title="Send Email to Guardian"
                                >
                                  <Mail size={11} /> Email
                                </button>
                                <button
                                  onClick={() => setEditingClient(client)}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-honey hover:text-[#0C0804] text-white/80 hover:text-[#0C0804] text-[9px] uppercase tracking-widest font-bold rounded-sm transition-all border border-white/20"
                                >
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: JAR ORDERS & SHIPMENTS                                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#140E08] border border-honey/20 p-4 rounded-[2px]">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey/50" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search jar orders by ref #, customer, variety, or city..."
                  className="w-full bg-black/60 border border-honey/20 pl-10 pr-4 py-2.5 text-xs text-white rounded-[2px] focus:outline-none focus:border-honey"
                />
              </div>

              <div className="flex items-center gap-2">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'pending', label: 'Pending Packaging' },
                  { id: 'packed', label: 'Ready for Courier' },
                  { id: 'shipped', label: 'Shipped' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id as any)}
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold rounded-[2px] transition-all border ${
                      orderFilter === f.id
                        ? 'bg-honey text-[#0C0804] border-honey shadow-sm'
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-honey/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#140E08] border border-honey/20 rounded-[2px] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-honey/20 bg-black/60 text-[9px] uppercase tracking-widest text-honey/70 font-mono">
                      <th className="py-4 px-6">Order Ref</th>
                      <th className="py-4 px-6">Honey Items Ordered</th>
                      <th className="py-4 px-6">Customer & Shipping Address</th>
                      <th className="py-4 px-6">Total Paid</th>
                      <th className="py-4 px-6">Courier Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-honey/10">
                    {filteredJarOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-white/40">
                          No jar orders match the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredJarOrders.map(order => {
                        const fullAddr = `${order.customer.address}, ${order.customer.city}, ${order.customer.postalCode}, ${order.customer.country}`;
                        return (
                          <tr key={order.id} className="hover:bg-honey/5 transition-colors">
                            <td className="py-4 px-6 font-mono text-honey font-bold whitespace-nowrap">
                              {order.orderRef}
                              <div className="text-[9px] text-white/40 font-normal">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="font-bold text-white text-sm">{order.variety}</div>
                              <div className="text-[11px] text-honey font-mono">
                                {order.quantity}x {order.size} ({order.weightKg} kg total)
                              </div>
                              {order.isGift && (
                                <div className="text-[10px] text-purple-300 mt-1 flex items-center gap-1 bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded-sm">
                                  <Gift size={10} /> Gift: "{order.giftNote}"
                                </div>
                              )}
                            </td>

                            <td className="py-4 px-6 max-w-xs">
                              <div className="font-medium text-white">{order.customer.fullName}</div>
                              <div className="text-[11px] text-white/60 font-mono">{order.customer.email}</div>
                              <div className="text-[11px] text-white/80 mt-1 flex items-start gap-1">
                                <MapPin size={11} className="text-honey shrink-0 mt-0.5" />
                                <span>{fullAddr}</span>
                              </div>
                              <button
                                onClick={() => handleCopyAddress(order.id, `${order.customer.fullName}\n${fullAddr}\nPhone: ${order.customer.phone || 'N/A'}`)}
                                className="text-[9px] uppercase tracking-wider font-bold text-honey/70 hover:text-honey flex items-center gap-1 pt-1"
                              >
                                {copiedAddressId === order.id ? (
                                  <><Check size={10} className="text-green-400" /> Copied!</>
                                ) : (
                                  <><Copy size={10} /> Copy Courier Label</>
                                )}
                              </button>
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap font-display text-lg text-honey font-bold">
                              €{order.grandTotal}.00
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap">
                              <select
                                value={order.status}
                                onChange={async e => {
                                  const newStatus = e.target.value as any;
                                  await updateJarOrder(order.id, { status: newStatus });
                                  if (['packed', 'shipped', 'delivered'].includes(newStatus)) {
                                    const statusMap: Record<string, 'PACKED' | 'DISPATCHED' | 'DELIVERED'> = {
                                      packed: 'PACKED',
                                      shipped: 'DISPATCHED',
                                      delivered: 'DELIVERED'
                                    };
                                    await sendEmail(emailTemplates.harvestStatusUpdated(
                                      order.customer.email,
                                      order.customer.fullName || 'Customer',
                                      statusMap[newStatus],
                                      order.trackingNumber,
                                      order.carrier || 'Express Courier'
                                    ));
                                    showToast(`✓ Order status set to ${newStatus.toUpperCase()} · Email sent to ${order.customer.email}`);
                                  } else {
                                    showToast(`✓ Order status updated to ${newStatus}`);
                                  }
                                }}
                                className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1.5 rounded-sm border outline-none bg-black/70 cursor-pointer ${
                                  order.status === 'delivered'
                                    ? 'text-green-400 border-green-500/40'
                                    : order.status === 'shipped'
                                    ? 'text-purple-400 border-purple-500/40'
                                    : order.status === 'packed'
                                    ? 'text-blue-400 border-blue-500/40'
                                    : 'text-orange-400 border-orange-500/40'
                                }`}
                              >
                                <option value="pending">PENDING PACKAGING</option>
                                <option value="packed">PACKED IN GLASS</option>
                                <option value="shipped">SHIPPED TO DESTINATION</option>
                                <option value="delivered">DELIVERED</option>
                              </select>
                            </td>

                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setPackingSlipData({
                                    orderRef: order.orderRef,
                                    orderDate: new Date(order.createdAt).toLocaleDateString('en-GB'),
                                    customerName: order.customer.fullName,
                                    customerEmail: order.customer.email,
                                    customerPhone: order.customer.phone,
                                    shippingAddress: order.customer.address,
                                    city: order.customer.city,
                                    postalCode: order.customer.postalCode,
                                    country: order.customer.country || 'Greece',
                                    trackingNumber: order.trackingNumber,
                                    carrier: order.carrier || 'Express Courier',
                                    totalAmount: order.grandTotal,
                                    items: [
                                      {
                                        description: order.variety,
                                        quantity: order.quantity,
                                        size: order.size,
                                        customLabel: order.customLabel,
                                      }
                                    ]
                                  })}
                                  className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[9px] uppercase tracking-widest font-bold rounded-sm transition-all border border-white/15 flex items-center gap-1"
                                  title="Print Courier Packing Slip"
                                >
                                  <Printer size={11} /> Slip
                                </button>
                                <button
                                  onClick={() => openWhatsAppOutreach(order.customer.phone, order.customer.fullName, order.orderRef)}
                                  className="px-2 py-1.5 bg-green-500/10 hover:bg-green-500 hover:text-black text-green-400 text-[9px] uppercase tracking-widest font-bold rounded-sm transition-all border border-green-500/30 flex items-center gap-1"
                                  title="1-Click WhatsApp Outreach"
                                >
                                  <MessageSquare size={11} /> WA
                                </button>
                                <button
                                  onClick={() => setEmailModalData({
                                    to: order.customer.email,
                                    name: order.customer.fullName || 'Customer',
                                    subject: `Update on your Greek Honey Order [${order.orderRef}]`,
                                    message: `Dear ${order.customer.fullName || 'Customer'},\n\nWe are preparing your single-batch order of ${order.quantity}x ${order.variety} (${order.size}) at our Laconia apiary.\n\nWarm regards,\nPetros & Gregory Oikonomakos`,
                                    preset: 'custom'
                                  })}
                                  className="px-2.5 py-1.5 bg-honey/10 hover:bg-honey hover:text-[#0C0804] text-honey text-[9px] uppercase tracking-widest font-bold rounded-sm transition-all border border-honey/30 flex items-center gap-1"
                                  title="Send Email to Customer"
                                >
                                  <Mail size={11} /> Email
                                </button>
                                <button
                                  onClick={() => setEditingOrder(order)}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-honey hover:text-[#0C0804] text-white/80 hover:text-[#0C0804] text-[9px] uppercase tracking-widest font-bold rounded-sm transition-all border border-white/20"
                                >
                                  Manage
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: APIARY FLEET                                                 */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'hives' && (
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-80 shrink-0">
              <AdminHiveGrid
                hives={hives}
                filteredHives={hives.filter(h =>
                  h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  h.location.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedHiveId={selectedHiveId}
                setSelectedHiveId={setSelectedHiveId}
                selectedHiveIds={[]}
                setSelectedHiveIds={() => {}}
                isAddingHive={isAddingHive}
                handleAddHive={async () => {
                  setIsAddingHive(true);
                  try { await addHive(); } catch (e: any) { alert(e.message); }
                  setIsAddingHive(false);
                }}
              />
            </aside>

            <div className="flex-1">
              {selectedHive ? (
                <AdminHiveDetails
                  selectedHive={selectedHive}
                  updateHive={updateHive}
                  pushHivePulse={pushHivePulse}
                  seedHiveHistory={seedHiveHistory}
                  addJournalEntry={addJournalEntry}
                  removeHive={removeHive}
                />
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-center space-y-3 bg-[#140E08] border border-honey/20 rounded-[2px] p-8">
                  <Zap size={36} className="text-honey/30" />
                  <h3 className="font-display text-2xl text-white">Select a Hive Unit</h3>
                  <p className="text-xs text-honey/50 max-w-sm">
                    Select any hive from the fleet on the left to calibrate telemetry, update microclimate status, or add beekeeper harvest entries.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: FINANCIAL HEALTH & PACKAGING INVENTORY                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'finance' && (
          <div className="space-y-8">
            <AdminFinance users={users} />

            {/* Packaging Supplies & Glass Inventory in Sparta */}
            <div className="bg-[#140E08] border border-honey/20 p-8 rounded-[2px] shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-honey/15 pb-4">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.3em] text-honey font-bold">Physical Fulfillment Inventory</div>
                  <h3 className="font-display text-2xl text-white">Glassware & Packaging Supplies (Sparta Facility)</h3>
                </div>
                <div className="text-[10px] uppercase font-mono text-honey/70 bg-honey/10 px-3 py-1 border border-honey/20 rounded-sm">
                  Facility Status: Ready for Extraction
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 250g Jars */}
                <div className="bg-black/50 border border-honey/15 p-5 rounded-[2px] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">250g Hexagonal Jars</span>
                    <span className="font-mono text-honey font-bold">284 / 500</span>
                  </div>
                  <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-honey h-full" style={{ width: '56.8%' }} />
                  </div>
                  <div className="text-[10px] text-white/50">For Starter welcome jars & gift sets</div>
                </div>

                {/* 500g Jars */}
                <div className="bg-black/50 border border-honey/15 p-5 rounded-[2px] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">500g Classic Laconian Jars</span>
                    <span className="font-mono text-honey font-bold">192 / 400</span>
                  </div>
                  <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-honey h-full" style={{ width: '48%' }} />
                  </div>
                  <div className="text-[10px] text-white/50">Core seasonal harvest jars for patrons</div>
                </div>

                {/* 1kg Jars */}
                <div className="bg-black/50 border border-honey/15 p-5 rounded-[2px] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">1,000g Connoisseur Pots</span>
                    <span className="font-mono text-honey font-bold">64 / 150</span>
                  </div>
                  <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-honey h-full" style={{ width: '42.6%' }} />
                  </div>
                  <div className="text-[10px] text-white/50">Heavyweight preserve jars & corporate</div>
                </div>

                {/* Lids */}
                <div className="bg-black/50 border border-honey/15 p-5 rounded-[2px] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Tamper-Evident Gold Lids</span>
                    <span className="font-mono text-green-400 font-bold">540 / 1,000</span>
                  </div>
                  <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-green-400 h-full" style={{ width: '54%' }} />
                  </div>
                  <div className="text-[10px] text-white/50">Vacuum seal twist-off 70mm & 82mm</div>
                </div>

                {/* Corrugated Sleeves */}
                <div className="bg-black/50 border border-honey/15 p-5 rounded-[2px] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Corrugated Glass Mailers</span>
                    <span className="font-mono text-honey font-bold">310 / 500</span>
                  </div>
                  <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-honey h-full" style={{ width: '62%' }} />
                  </div>
                  <div className="text-[10px] text-white/50">Shock-absorbing international parcel sleeves</div>
                </div>

                {/* Wax Seals */}
                <div className="bg-black/50 border border-honey/15 p-5 rounded-[2px] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Wax Seals & Linen Cords</span>
                    <span className="font-mono text-honey font-bold">148 / 300</span>
                  </div>
                  <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-honey h-full" style={{ width: '49.3%' }} />
                  </div>
                  <div className="text-[10px] text-white/50">Hand-stamped Oikonomakos beeswax emblems</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── EDIT CLIENT PROFILE & ADDRESS MODAL ── */}
      {editingClient && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingClient(null)} />
          <div className="relative z-10 bg-[#16100A] border border-honey/30 rounded-[2px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-honey/15 pb-4">
              <div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-honey font-bold">Client Record CRM</div>
                <h3 className="font-display text-2xl text-white">{editingClient.fullName || editingClient.email}</h3>
              </div>
              <button onClick={() => setEditingClient(null)} className="text-white/40 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingClient.fullName || ''}
                    onChange={e => setEditingClient({ ...editingClient, fullName: e.target.value })}
                    className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingClient.phone || ''}
                    onChange={e => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Street Address</label>
                <input
                  type="text"
                  value={editingClient.shippingAddress || ''}
                  onChange={e => setEditingClient({ ...editingClient, shippingAddress: e.target.value })}
                  placeholder="Street and apartment number"
                  className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={editingClient.city || ''}
                    onChange={e => setEditingClient({ ...editingClient, city: e.target.value })}
                    className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={editingClient.postalCode || ''}
                    onChange={e => setEditingClient({ ...editingClient, postalCode: e.target.value })}
                    className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Country</label>
                  <input
                    type="text"
                    value={editingClient.country || ''}
                    onChange={e => setEditingClient({ ...editingClient, country: e.target.value })}
                    className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Membership Tier</label>
                  <select
                    value={editingClient.tier || 'none'}
                    onChange={e => setEditingClient({ ...editingClient, tier: e.target.value as any })}
                    className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey uppercase font-bold text-xs"
                  >
                    <option value="none">None (Observer)</option>
                    <option value="starter">Starter Guardianship (€140)</option>
                    <option value="premium">Premium Patron (€340)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Harvest Dispatch Status</label>
                  <select
                    value={editingClient.userHarvestStatus || 'PENDING'}
                    onChange={e => setEditingClient({ ...editingClient, userHarvestStatus: e.target.value as any })}
                    className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey uppercase font-bold text-xs"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PACKED">PACKED IN GLASS</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Custom Honey Jar Name</label>
                  <input
                    type="text"
                    value={editingClient.customHoneyName || ''}
                    onChange={e => setEditingClient({ ...editingClient, customHoneyName: e.target.value })}
                    placeholder="e.g. Elena's Taygetos Reserve"
                    className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Courier Tracking Code</label>
                  <input
                    type="text"
                    value={editingClient.trackingNumber || ''}
                    onChange={e => setEditingClient({ ...editingClient, trackingNumber: e.target.value })}
                    placeholder="e.g. DHL-DE-9481928"
                    className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Admin / Beekeeper Notes</label>
                <textarea
                  rows={2}
                  value={editingClient.adminNotes || ''}
                  onChange={e => setEditingClient({ ...editingClient, adminNotes: e.target.value })}
                  placeholder="Private notes about this client (preferences, history, etc.)"
                  className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-honey/15">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove ${editingClient.fullName || editingClient.email} from client registry?`)) {
                    deleteUser(editingClient.uid);
                    setEditingClient(null);
                  }
                }}
                className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider"
              >
                Delete Client
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 border border-white/20 text-white hover:bg-white/5 rounded-[2px] text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateUser(editingClient.uid, editingClient);
                    if (['PACKED', 'DISPATCHED', 'DELIVERED'].includes(editingClient.userHarvestStatus || '')) {
                      await sendEmail(emailTemplates.harvestStatusUpdated(
                        editingClient.email,
                        editingClient.fullName || 'Guardian',
                        editingClient.userHarvestStatus as any,
                        editingClient.trackingNumber,
                        editingClient.courierNotes || 'Express Courier'
                      ));
                      showToast(`✓ Client profile updated & ${editingClient.userHarvestStatus} email sent to ${editingClient.email}`);
                    } else {
                      showToast(`✓ Client profile updated successfully`);
                    }
                    setEditingClient(null);
                  }}
                  className="px-6 py-2 bg-honey text-[#0C0804] hover:bg-honey/90 rounded-[2px] text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Save Client Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT ORDER MODAL ── */}
      {editingOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingOrder(null)} />
          <div className="relative z-10 bg-[#16100A] border border-honey/30 rounded-[2px] shadow-2xl w-full max-w-lg p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-honey/15 pb-4">
              <div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-honey font-bold">Manage Order</div>
                <h3 className="font-display text-2xl text-white">{editingOrder.orderRef}</h3>
              </div>
              <button onClick={() => setEditingOrder(null)} className="text-white/40 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-black/50 border border-honey/20 rounded-[2px] space-y-1">
                <div className="font-bold text-white text-sm">{editingOrder.variety}</div>
                <div className="text-honey font-mono">{editingOrder.quantity}x {editingOrder.size} · €{editingOrder.grandTotal}.00 Total</div>
                <div className="text-white/60">{editingOrder.customer.fullName} · {editingOrder.customer.email}</div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Courier Status</label>
                <select
                  value={editingOrder.status}
                  onChange={e => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                  className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey font-bold"
                >
                  <option value="pending">PENDING PACKAGING</option>
                  <option value="packed">PACKED IN GLASS</option>
                  <option value="shipped">SHIPPED TO DESTINATION</option>
                  <option value="delivered">DELIVERED</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Courier Tracking Code</label>
                <input
                  type="text"
                  value={editingOrder.trackingNumber || ''}
                  onChange={e => setEditingOrder({ ...editingOrder, trackingNumber: e.target.value })}
                  placeholder="e.g. POSTNL-NL-389104"
                  className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey font-mono"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Carrier Name</label>
                <input
                  type="text"
                  value={editingOrder.carrier || ''}
                  onChange={e => setEditingOrder({ ...editingOrder, carrier: e.target.value })}
                  placeholder="e.g. DHL Express, ELTA Courier"
                  className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-honey/15">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete order ${editingOrder.orderRef}?`)) {
                    deleteJarOrder(editingOrder.id);
                    setEditingOrder(null);
                  }
                }}
                className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider"
              >
                Delete Order
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border border-white/20 text-white hover:bg-white/5 rounded-[2px] text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateJarOrder(editingOrder.id, editingOrder);
                    if (['packed', 'shipped', 'delivered'].includes(editingOrder.status)) {
                      const statusMap: Record<string, 'PACKED' | 'DISPATCHED' | 'DELIVERED'> = {
                        packed: 'PACKED',
                        shipped: 'DISPATCHED',
                        delivered: 'DELIVERED'
                      };
                      await sendEmail(emailTemplates.harvestStatusUpdated(
                        editingOrder.customer.email,
                        editingOrder.customer.fullName || 'Customer',
                        statusMap[editingOrder.status],
                        editingOrder.trackingNumber,
                        editingOrder.carrier || 'Express Courier'
                      ));
                      showToast(`✓ Order updated & ${editingOrder.status.toUpperCase()} email sent to ${editingOrder.customer.email}`);
                    } else {
                      showToast(`✓ Order updated successfully`);
                    }
                    setEditingOrder(null);
                  }}
                  className="px-6 py-2 bg-honey text-[#0C0804] hover:bg-honey/90 rounded-[2px] text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Save Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EMAIL COMPOSER MODAL (Gregory Outbox) ── */}
      {emailModalData && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => !isSendingEmail && setEmailModalData(null)} />
          <div className="relative z-10 bg-[#16100A] border border-honey/40 rounded-[2px] shadow-2xl w-full max-w-xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-honey/15 pb-4">
              <div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-honey font-bold flex items-center gap-2">
                  <Mail size={12} /> Direct Client Outreach
                </div>
                <h3 className="font-display text-2xl text-white">Send Email to {emailModalData.name}</h3>
                <div className="text-white/50 text-xs font-mono mt-0.5">{emailModalData.to}</div>
              </div>
              <button
                disabled={isSendingEmail}
                onClick={() => setEmailModalData(null)}
                className="text-white/40 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Template Presets */}
            <div>
              <div className="text-[9px] uppercase tracking-widest text-honey/70 font-bold mb-2">Insert Message Presets:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEmailModalData({
                    ...emailModalData,
                    subject: `Fulfillment Update: Your Raw Honey is in Transit`,
                    message: `Dear ${emailModalData.name},\n\nWe wanted to let you know that your artisanal honey jars have been packaged at our Mani extraction facility and are being picked up by our courier partner today.\n\nYou will receive live tracking coordinates as soon as the first depot scans the parcel.\n\nWarm regards,\nGregory & Petros Oikonomakos`
                  })}
                  className="px-2.5 py-1 bg-white/5 hover:bg-honey/20 text-white/80 hover:text-honey border border-white/10 rounded-sm text-[10px]"
                >
                  🚚 Courier Dispatch
                </button>
                <button
                  type="button"
                  onClick={() => setEmailModalData({
                    ...emailModalData,
                    subject: `Apiary Update: Spring Extraction & Flowering Note`,
                    message: `Dear ${emailModalData.name},\n\nWe are pleased to report that the thyme and wild mountain savory are in peak bloom around our colonies in Lagia, Mani. Hive health and colony strength remain exceptional.\n\nWe look forward to pouring your dedicated reserve soon.\n\nWarm regards,\nPetros Oikonomakos`
                  })}
                  className="px-2.5 py-1 bg-white/5 hover:bg-honey/20 text-white/80 hover:text-honey border border-white/10 rounded-sm text-[10px]"
                >
                  🌸 Bloom & Colony Note
                </button>
                <button
                  type="button"
                  onClick={() => setEmailModalData({
                    ...emailModalData,
                    subject: `Shipping Address Verification for HiveShare Delivery`,
                    message: `Dear ${emailModalData.name},\n\nBefore we bottle and dispatch your next seasonal harvest, please verify or update your delivery address in your HiveShare member portal:\nhttps://oikonomakos.gr/dashboard\n\nThank you for supporting sustainable nomadic beekeeping in Greece.\n\nGregory Oikonomakos`
                  })}
                  className="px-2.5 py-1 bg-white/5 hover:bg-honey/20 text-white/80 hover:text-honey border border-white/10 rounded-sm text-[10px]"
                >
                  📍 Verify Address
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={emailModalData.subject}
                  onChange={e => setEmailModalData({ ...emailModalData, subject: e.target.value })}
                  className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-honey font-bold mb-1">Message Content (Formatted into Branded Template)</label>
                <textarea
                  rows={6}
                  value={emailModalData.message}
                  onChange={e => setEmailModalData({ ...emailModalData, message: e.target.value })}
                  className="w-full bg-black/60 border border-honey/30 p-2.5 rounded-[2px] text-white focus:outline-none focus:border-honey leading-relaxed font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-honey/15">
              <button
                type="button"
                disabled={isSendingEmail}
                onClick={() => setEmailModalData(null)}
                className="px-4 py-2 border border-white/20 text-white hover:bg-white/5 rounded-[2px] text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSendingEmail}
                onClick={async () => {
                  setIsSendingEmail(true);
                  try {
                    await sendEmail(emailTemplates.customAdminMessage(
                      emailModalData.to,
                      emailModalData.name,
                      emailModalData.subject,
                      emailModalData.message
                    ));
                    showToast(`✓ Email successfully sent to ${emailModalData.to}`);
                    setEmailModalData(null);
                  } catch (err) {
                    console.error(err);
                    showToast(`⚠️ Failed to dispatch email. Check logs.`);
                  } finally {
                    setIsSendingEmail(false);
                  }
                }}
                className="px-6 py-2.5 bg-honey text-[#0C0804] hover:bg-honey/90 disabled:opacity-50 rounded-[2px] text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2"
              >
                {isSendingEmail ? (
                  <><RefreshCw size={14} className="animate-spin" /> Dispatching...</>
                ) : (
                  <><Mail size={14} /> Send Email Now</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[300] bg-honey text-[#0C0804] px-5 py-3 rounded-[2px] font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle size={16} className="text-[#0C0804]" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-70 text-[#0C0804]">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── COURIER PACKING SLIP MODAL ── */}
      <PackingSlipModal
        isOpen={!!packingSlipData}
        onClose={() => setPackingSlipData(null)}
        data={packingSlipData}
      />

      <Footer />
    </div>
  );
}
