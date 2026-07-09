import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------- DATE DE BAZA ----------
const DEFAULT_LOCATIONS = [
  { id: "BAL", name: "Balcescu" },
  { id: "SOM", name: "Somesului" },
  { id: "CIN", name: "Cisnadie Cindrelul" },
  { id: "PRO", name: "Cisnadie Productie" },
];
const DEPTS = [
  { id: "buc", name: "Bucatarie", color: "bg-amber-100 text-amber-800" },
  { id: "bar", name: "Bar", color: "bg-sky-100 text-sky-800" },
  { id: "cof", name: "Cofetarie", color: "bg-pink-100 text-pink-800" },
  { id: "pro", name: "Productie", color: "bg-violet-100 text-violet-800" },
  { id: "b2b", name: "Client B2B", color: "bg-teal-100 text-teal-800" },
];
const ALLD = ["buc", "bar", "cof", "pro"];

const DEMO_USERS = [
  { id: 1, name: "Ionut", pin: "1111", role: "admin", locs: ["SOM", "BAL", "CIN", "PRO"], depts: ["buc", "bar", "cof", "pro"], direct: true, approverId: null, canAddUsers: true },
  { id: 2, name: "Mirabela", pin: "2222", role: "aprobator", locs: ["SOM", "BAL"], depts: ["buc", "bar", "cof"], direct: true, approverId: null, canAddUsers: true },
  { id: 3, name: "Radu", pin: "3333", role: "angajat", locs: ["BAL", "SOM", "CIN"], depts: ["bar"], direct: true, approverId: 2, canAddUsers: true },
  { id: 4, name: "Luminita", pin: "4444", role: "angajat", locs: ["SOM"], depts: ["cof"], direct: true, approverId: 2, canAddUsers: true },
  { id: 5, name: "Daniel", pin: "5555", role: "angajat", locs: ["SOM"], depts: ["buc"], direct: false, approverId: 2, canAddUsers: false },
  { id: 6, name: "Gabi", pin: "6666", role: "angajat", locs: ["BAL"], depts: ["buc"], direct: false, approverId: 2, canAddUsers: false },
];

const DEMO_SUPPLIERS = [
  { id: "metro", name: "Metro", phone: "40722000001", days: "Comenzi: zilnic pana la 14:00", pickup: true,
    templates: { BAL: "Comanda Turtha - Balcescu:", SOM: "Comanda Turtha - Somesului:", CIN: "Comanda Turtha - Cisnadie Cindrelul:", PRO: "Comanda Turtha - Productie Cisnadie:" } },
  { id: "selgros", name: "Selgros", phone: "40722000002", days: "Ridicare de sofer", pickup: true,
    templates: { BAL: "De luat de la Selgros pentru Balcescu:", SOM: "De luat de la Selgros pentru Somesului:", CIN: "De luat de la Selgros pentru Cisnadie:", PRO: "De luat de la Selgros pentru Productie:" } },
  { id: "kaufland", name: "Kaufland", phone: "40722000003", days: "Ridicare de sofer", pickup: true,
    templates: { BAL: "De luat de la Kaufland pentru Balcescu:", SOM: "De luat de la Kaufland pentru Somesului:", CIN: "De luat de la Kaufland pentru Cisnadie:", PRO: "De luat de la Kaufland pentru Productie:" } },
  { id: "lidl", name: "Lidl", phone: "40722000004", days: "Ridicare de sofer", pickup: true,
    templates: { BAL: "De luat de la Lidl pentru Balcescu:", SOM: "De luat de la Lidl pentru Somesului:", CIN: "De luat de la Lidl pentru Cisnadie:", PRO: "De luat de la Lidl pentru Productie:" } },
  { id: "miramax", name: "Miramax", phone: "40722000005", days: "Zile de comanda: miercuri si duminica", pickup: false,
    templates: { BAL: "Comanda Turtha Balcescu (livrare separata de Somesului!):", SOM: "Comanda Turtha Somesului:", CIN: "Comanda Turtha Cisnadie:", PRO: "Comanda Productie Cisnadie:" } },
  { id: "albota", name: "Albota", phone: "40722000006", days: "Livrare locala - pastravarie/branzeturi", pickup: false,
    templates: { BAL: "Buna ziua! Comanda Turtha Balcescu:", SOM: "Buna ziua! Comanda Turtha Somesului:", CIN: "Buna ziua! Comanda Turtha Cisnadie:", PRO: "Buna ziua! Comanda Productie Cisnadie:" } },
  { id: "hala", name: "Hala", phone: "40722000007", days: "Piata/Hala - ridicare de sofer", pickup: true,
    templates: { BAL: "De luat din Hala pentru Balcescu:", SOM: "De luat din Hala pentru Somesului:", CIN: "De luat din Hala pentru Cisnadie:", PRO: "De luat din Hala pentru Productie:" } },
  { id: "centrala", name: "Centrala (productie interna)", phone: "40722000008", days: "Productie interna Cisnadie", pickup: true,
    templates: { BAL: "Necesar de la Productie -> Balcescu:", SOM: "Necesar de la Productie -> Somesului:", CIN: "Necesar de la Productie -> Cisnadie Cindrelul:", PRO: "Necesar intern Productie:" } },
];

const DEMO_PRODUCTS = [
  { id: 1, name: "Piept pui", cat: "Carne", um: "kg", sup: "metro", depts: ["buc"] },
  { id: 2, name: "Pulpe pui", cat: "Carne", um: "kg", sup: "metro", depts: ["buc"] },
  { id: 3, name: "Pulpe pui dezosate cu piele", cat: "Carne", um: "kg", sup: "metro", depts: ["buc"] },
  { id: 4, name: "Ceafa porc", cat: "Carne", um: "kg", sup: "metro", depts: ["buc"] },
  { id: 5, name: "Vrabioara", cat: "Carne", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 6, name: "Bacon", cat: "Carne", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 7, name: "Carnati", cat: "Carne", um: "kg", sup: "metro", depts: ["buc"] },
  { id: 8, name: "Somon proaspat", cat: "Peste", um: "kg", sup: "metro", depts: ["buc"] },
  { id: 9, name: "Feta", cat: "Lactate & Branzeturi", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 10, name: "Telemea vaca", cat: "Lactate & Branzeturi", um: "kg", sup: "metro", depts: ["buc"] },
  { id: 11, name: "Brie", cat: "Lactate & Branzeturi", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 12, name: "Gorgonzola", cat: "Lactate & Branzeturi", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 13, name: "Parmezan calup", cat: "Lactate & Branzeturi", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 14, name: "Smantana", cat: "Lactate & Branzeturi", um: "kg", sup: "metro", depts: ["buc", "cof"] },
  { id: 15, name: "Iaurt", cat: "Lactate & Branzeturi", um: "kg", sup: "metro", depts: ["buc", "cof"] },
  { id: 16, name: "Oua", cat: "Lactate & Branzeturi", um: "cofraj", sup: "metro", depts: ["buc", "cof", "pro"] },
  { id: 17, name: "Ceapa chives", cat: "Legume & Fructe", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 18, name: "Microplante", cat: "Legume & Fructe", um: "buc", sup: "metro", depts: ["buc", "bar"] },
  { id: 19, name: "Cartofi mov", cat: "Legume & Fructe", um: "kg", sup: "metro", depts: ["buc"] },
  { id: 20, name: "Mango proaspat", cat: "Legume & Fructe", um: "kg", sup: "metro", depts: ["buc", "bar", "cof"] },
  { id: 21, name: "Mango congelat", cat: "Congelate", um: "punga", sup: "metro", depts: ["buc", "bar", "cof"] },
  { id: 22, name: "Creveti congelati", cat: "Congelate", um: "punga", sup: "metro", depts: ["buc"] },
  { id: 23, name: "Naut conserva", cat: "Bacanie", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 24, name: "Fasole in sos tomat", cat: "Bacanie", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 25, name: "Nachos", cat: "Bacanie", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 26, name: "Tortilla chips", cat: "Bacanie", um: "punga", sup: "metro", depts: ["buc"] },
  { id: 27, name: "Muraturi asortate", cat: "Bacanie", um: "bidon", sup: "metro", depts: ["buc"] },
  { id: 28, name: "Ulei floarea-soarelui", cat: "Bacanie", um: "l", sup: "metro", depts: ["buc", "pro"], stepQty: 5, packLabel: "bidon 5 l" },
  { id: 29, name: "Ulei masline", cat: "Bacanie", um: "l", sup: "metro", depts: ["buc"] },
  { id: 30, name: "Mustar Dijon", cat: "Sosuri & Condimente", um: "borcan", sup: "metro", depts: ["buc"] },
  { id: 31, name: "Mustar boabe", cat: "Sosuri & Condimente", um: "borcan", sup: "metro", depts: ["buc"] },
  { id: 32, name: "Sos cheddar", cat: "Sosuri & Condimente", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 33, name: "Sos BBQ", cat: "Sosuri & Condimente", um: "bidon", sup: "metro", depts: ["buc"] },
  { id: 34, name: "Cardamom praf", cat: "Sosuri & Condimente", um: "buc", sup: "metro", depts: ["buc", "cof"] },
  { id: 35, name: "Vin rosu gatit", cat: "Bauturi", um: "cutie", sup: "metro", depts: ["buc"] },
  { id: 36, name: "Folie aluminiu", cat: "Curatenie & Consumabile", um: "buc", sup: "metro", depts: ALLD },
  { id: 37, name: "Solutie spalat vase", cat: "Curatenie & Consumabile", um: "bidon", sup: "metro", depts: ALLD },
  { id: 38, name: "Sano Forte", cat: "Curatenie & Consumabile", um: "buc", sup: "metro", depts: ALLD },
  { id: 39, name: "Suport tacamuri industrial", cat: "Curatenie & Consumabile", um: "buc", sup: "metro", depts: ["buc"] },
  { id: 40, name: "Cartofi dulci", cat: "Legume & Fructe", um: "kg", sup: "miramax", depts: ["buc"] },
  { id: 41, name: "Cartofi dulci pt. prajit", cat: "Congelate", um: "punga", sup: "miramax", depts: ["buc"] },
  { id: 42, name: "Parmezan", cat: "Lactate & Branzeturi", um: "kg", sup: "miramax", depts: ["buc"] },
  { id: 43, name: "Tahini", cat: "Bacanie", um: "buc", sup: "miramax", depts: ["buc"] },
  { id: 44, name: "Fasole bruna", cat: "Bacanie", um: "buc", sup: "miramax", depts: ["buc"] },
  { id: 45, name: "Somon afumat", cat: "Peste", um: "buc", sup: "miramax", depts: ["buc"] },
  { id: 46, name: "Panko", cat: "Bacanie", um: "punga", sup: "miramax", depts: ["buc"] },
  { id: 47, name: "Ceapa crocanta", cat: "Bacanie", um: "kg", sup: "miramax", depts: ["buc"] },
  { id: 48, name: "Piper macinat", cat: "Sosuri & Condimente", um: "kg", sup: "miramax", depts: ["buc"] },
  { id: 49, name: "Avocado", cat: "Legume & Fructe", um: "buc", sup: "kaufland", depts: ["buc", "bar"] },
  { id: 50, name: "Rodie", cat: "Legume & Fructe", um: "buc", sup: "kaufland", depts: ["buc", "bar"] },
  { id: 51, name: "Pastrav afumat", cat: "Peste", um: "buc", sup: "albota", depts: ["buc"] },
  { id: 52, name: "Branza cu chilli", cat: "Lactate & Branzeturi", um: "buc", sup: "albota", depts: ["buc"] },
  { id: 53, name: "Branza cu trufe", cat: "Lactate & Branzeturi", um: "buc", sup: "albota", depts: ["buc"] },
  { id: 54, name: "Branza cu fistic", cat: "Lactate & Branzeturi", um: "buc", sup: "albota", depts: ["buc"] },
  { id: 55, name: "Branza feta Albota", cat: "Lactate & Branzeturi", um: "buc", sup: "albota", depts: ["buc"] },
  { id: 56, name: "Carbuni", cat: "Curatenie & Consumabile", um: "buc", sup: "hala", depts: ["buc"] },
  { id: 57, name: "Burger (carne)", cat: "Productie interna", um: "buc", sup: "centrala", depts: ["buc"] },
  { id: 58, name: "Dulceata de ardei", cat: "Productie interna", um: "kg", sup: "centrala", depts: ["buc"] },
  { id: 59, name: "Granola", cat: "Productie interna", um: "kg", sup: "centrala", depts: ["buc", "cof"] },
  { id: 60, name: "Vita quesadilla", cat: "Productie interna", um: "kg", sup: "centrala", depts: ["buc"] },
  { id: 61, name: "Pulled pork", cat: "Productie interna", um: "kg", sup: "centrala", depts: ["buc"] },
  { id: 62, name: "Sirop mango", cat: "Productie interna", um: "punga", sup: "centrala", depts: ["bar", "b2b"] },
  { id: 63, name: "Croissant unt", cat: "Productie interna", um: "buc", sup: "centrala", depts: ["b2b", "cof"] },
  { id: 64, name: "Ciocolata neagra", cat: "Bacanie", um: "kg", sup: "metro", depts: ["buc", "cof"], stepQty: 5, minQty: 5, packLabel: "galeata 5 kg" },
];

const STORE_KEY = "turtha-necesar-v7";

// ---------- HELPERS ----------
const deptOf = (id) => DEPTS.find((d) => d.id === id) || DEPTS[0];
const fmtDate = (ts) => new Date(ts).toLocaleString("ro-RO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const fmtDay = (ts) => new Date(ts).toLocaleDateString("ro-RO");

// Cantitate valida respectand stepQty si minQty
const validQty = (qty, p) => {
  if (!p || qty <= 0) return 0;
  const step = p.stepQty || 1;
  const min = p.minQty || 0;
  if (step <= 1) return qty;
  const snapped = Math.round(qty / step) * step || step;
  return min > 0 ? Math.max(snapped, min) : snapped;
};

// ---------- DEVICE LOCK (v10) ----------
// Un token aleator per dispozitiv, tinut doar in localStorage.
// In Supabase se salveaza DOAR hash-ul SHA-256 al tokenului + user_id.
// Nu se colecteaza IMEI, locatie, contacte sau alte date personale.
const DEVICE_TOKEN_KEY = "turtha-device-token";
const getDeviceToken = () => {
  try {
    let t = localStorage.getItem(DEVICE_TOKEN_KEY);
    if (!t) {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      t = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(DEVICE_TOKEN_KEY, t);
    }
    return t;
  } catch (e) { return null; }
};
const hashToken = async (t) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
};

export default function NecesarTurtha() {
  const [users, setUsers] = useState(DEMO_USERS);
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [suppliers, setSuppliers] = useState(DEMO_SUPPLIERS);
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [items, setItems] = useState([]);
  const [receptions, setReceptions] = useState({});
  const [devices, setDevices] = useState({}); // hash(deviceToken) -> userId // orderRef -> { productId: recQty }
  const [seq, setSeq] = useState(1);
  const [loaded, setLoaded] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeLoc, setActiveLoc] = useState(null);
  const [activeDept, setActiveDept] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [tab, setTab] = useState("necesar");
  const [cart, setCart] = useState({});
  const [deliveryDate, setDeliveryDate] = useState("");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Toate");
  const [supFilter, setSupFilter] = useState("toti");
  const [expanded, setExpanded] = useState({});
  const [toast, setToast] = useState(null);
  const [sendModal, setSendModal] = useState(null); // { loc, supId, supName, isGroup, msg, url, groupItems, queueRest }
  const [adminView, setAdminView] = useState("utilizatori");
  const [newProd, setNewProd] = useState({ name: "", cat: "Bacanie", um: "kg", sup: "metro", depts: ["buc"], stepQty: "", minQty: "", packLabel: "" });
  const [newLoc, setNewLoc] = useState({ id: "", name: "" });
  const [newUser, setNewUser] = useState({ name: "", pin: "", depts: ["buc"], locs: [], approverId: null });
  const [histSup, setHistSup] = useState("toti");
  const [histSearch, setHistSearch] = useState("");
  const [histDay, setHistDay] = useState("");
  const [newSup, setNewSup] = useState({ name: "", phone: "", days: "", pickup: false, dest: "phone" });

  const locName = (id) => locations.find((l) => l.id === id)?.name || id;
  const activeLocations = locations.filter((l) => !l.pending);

  // ---------- PERSISTENTA ----------
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("store")
          .select("value")
          .eq("key", STORE_KEY)
          .single();
        if (data && data.value && Object.keys(data.value).length > 0) {
          const d = data.value;
          if (d.users) setUsers(d.users);
          if (d.products) setProducts(d.products);
          if (d.suppliers) setSuppliers(d.suppliers);
          if (d.locations) setLocations(d.locations);
          if (d.items) setItems(d.items);
          if (d.receptions) setReceptions(d.receptions);
          if (d.devices) setDevices(d.devices);
          if (d.seq) setSeq(d.seq);
        }
      } catch (e) { /* prima rulare - date demo */ }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await supabase.from("store").upsert({
          key: STORE_KEY,
          value: { users, products, suppliers, locations, items, receptions, devices, seq },
          updated_at: new Date().toISOString(),
        });
      } catch (e) { console.error("Salvare esuata", e); }
    })();
  }, [users, products, suppliers, locations, items, receptions, devices, seq, loaded]);

  // Polling la fiecare 5 secunde
  useEffect(() => {
    let lastTs = null;
    const poll = async () => {
      try {
        const { data } = await supabase
          .from("store").select("value,updated_at").eq("key", STORE_KEY).single();
        if (data && data.updated_at !== lastTs) {
          lastTs = data.updated_at;
          const v = data.value;
          if (!v || Object.keys(v).length === 0) return;
          if (v.users) setUsers(v.users);
          if (v.products) setProducts(v.products);
          if (v.suppliers) setSuppliers(v.suppliers);
          if (v.locations) setLocations(v.locations);
          if (v.items) setItems(v.items);
          if (v.receptions) setReceptions(v.receptions);
          if (v.devices) setDevices(v.devices);
          if (v.seq) setSeq(v.seq);
        }
      } catch(e) {}
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  const me = users.find((u) => u.id === currentUserId);
  const isApprover = me && (me.role === "aprobator" || me.role === "admin");
  const isAdmin = me && me.role === "admin";

  // v10 Etapa 5: draft complet pentru Admin (Salveaza/Renunta)
  const [draft, setDraft] = useState(null); // { users, products, suppliers, locations } sau null
  const adminDirty = draft !== null;
  const dUsers = draft ? draft.users : users;
  const dProducts = draft ? draft.products : products;
  const dSuppliers = draft ? draft.suppliers : suppliers;
  const dLocations = draft ? draft.locations : locations;
  const dActiveLocations = dLocations.filter((l) => !l.pending);
  const ensureDraft = (fn) => setDraft((prev) => {
    const base = prev || { users, products, suppliers, locations };
    return fn(base);
  });
  const applyUpd = (upd, cur) => (typeof upd === "function" ? upd(cur) : upd);
  const setDUsers = (upd) => ensureDraft((b) => ({ ...b, users: applyUpd(upd, b.users) }));
  const setDProducts = (upd) => ensureDraft((b) => ({ ...b, products: applyUpd(upd, b.products) }));
  const setDSuppliers = (upd) => ensureDraft((b) => ({ ...b, suppliers: applyUpd(upd, b.suppliers) }));
  const setDLocations = (upd) => ensureDraft((b) => ({ ...b, locations: applyUpd(upd, b.locations) }));
  const saveAdmin = () => {
    if (!draft) return;
    setUsers(draft.users); setProducts(draft.products); setSuppliers(draft.suppliers); setLocations(draft.locations);
    setDraft(null); showToast("Modificari salvate");
  };
  const discardAdmin = () => { setDraft(null); showToast("Modificari anulate"); };
  const leaveAdminGuard = (action) => {
    if (adminDirty) {
      if (window.confirm("Ai modificari nesalvate in Admin. Renunti la ele?")) { setDraft(null); action(); }
    } else { action(); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // ---------- LOGIN (doar PIN, fara lista de utilizatori) ----------
  const tryLogin = async (pinArg) => {
    const code = typeof pinArg === "string" ? pinArg : pinInput;
    if (!loaded) { showToast("Se incarca datele... reincearca in 2 secunde"); return; }
    const u = users.find((x) => !x.pending && x.pin === code);
    if (!u) {
      showToast("PIN necunoscut");
      setPinInput("");
      return;
    }
    // Device lock: un dispozitiv = un singur utilizator
    try {
      const token = getDeviceToken();
      if (token) {
        const hash = await hashToken(token);
        const boundTo = devices[hash];
        if (boundTo && boundTo !== u.id) {
          const owner = users.find((x) => x.id === boundTo);
          showToast(`Dispozitiv asociat cu ${owner ? owner.name : "alt utilizator"}. Cere adminului resetarea dispozitivului.`);
          setPinInput("");
          return;
        }
        if (!boundTo) setDevices((prev) => ({ ...prev, [hash]: u.id }));
      }
    } catch (e) { /* browser vechi - loginul continua */ }
    setCurrentUserId(u.id);
    setActiveLoc(u.locs[0]);
    setActiveDept(u.depts[0]);
    setTab("necesar");
    setPinInput("");
  };

  const logout = () => { setCurrentUserId(null); setActiveLoc(null); setActiveDept(null); setCart({}); };

  // ---------- ACTIUNI ----------
  const submitCart = () => {
    const entries = Object.entries(cart).filter(([, q]) => q > 0);
    if (!entries.length) return;
    const status = me.direct ? "de_trimis" : "in_aprobare";
    let s = seq;
    const newItems = entries.map(([pid, qty]) => ({
      id: s++, productId: Number(pid), qty, userId: me.id, loc: activeLoc, dept: activeDept, status, ts: Date.now(),
      deliveryDate: deliveryDate || null,
    }));
    setSeq(s);
    setItems((prev) => [...prev, ...newItems]);
    setCart({});
    setDeliveryDate("");
    showToast(status === "de_trimis" ? "Necesar adaugat - gata de trimis" : "Necesar trimis spre aprobare");
    setTab("comenzi");
  };

  const canApproveItem = (it) => {
    if (isAdmin) return true;
    const owner = users.find((u) => u.id === it.userId);
    return owner && owner.approverId === me.id;
  };

  const approveGroup = (loc, sup) => {
    setItems((prev) => prev.map((it) => {
      const p = products.find((x) => x.id === it.productId);
      if (it.status === "in_aprobare" && it.loc === loc && p && p.sup === sup && canApproveItem(it)) {
        return { ...it, status: "de_trimis" };
      }
      return it;
    }));
    showToast("Aprobat - mutat la De trimis");
  };

  const updateQty = (itemId, delta) => {
    setItems((prev) => prev.map((it) => {
      if (it.id !== itemId) return it;
      const p = products.find((x) => x.id === it.productId);
      const step = p?.stepQty || 1;
      const newQty = it.qty + delta * step;
      if (newQty <= 0) return null;
      return { ...it, qty: validQty(newQty, p) || step };
    }).filter(Boolean));
  };

  // v10 Etapa 2: editare comanda pending (doar cat timp e in_aprobare)
  // Un item poate fi editat de proprietar sau de aprobatorul lui. Audit: modifiedBy + modifiedAt.
  const canEditPending = (it) => {
    if (it.status !== "in_aprobare") return false;
    if (!me) return false;
    if (it.userId === me.id) return true;
    return canApproveItem(it);
  };

  const editPendingQty = (itemId, delta) => {
    setItems((prev) => prev.map((it) => {
      if (it.id !== itemId) return it;
      if (!canEditPending(it)) return it;
      const p = products.find((x) => x.id === it.productId);
      const step = p?.stepQty || 1;
      const newQty = it.qty + delta * step;
      if (newQty <= 0) return null;
      return { ...it, qty: validQty(newQty, p) || step, modifiedBy: me.id, modifiedAt: Date.now() };
    }).filter(Boolean));
  };

  const deletePendingItem = (itemId) => {
    setItems((prev) => prev.filter((it) => {
      if (it.id !== itemId) return true;
      return !canEditPending(it);
    }));
    showToast("Produs sters din comanda");
  };

  // v10 Etapa 4: flux WhatsApp cu confirmare, tip destinatie (phone/grup), trimite toate
  const buildOrderMsg = (loc, supId, groupItems) => {
    const sup = suppliers.find((s) => s.id === supId);
    const header = (sup.templates && sup.templates[loc]) || `Comanda Turtha ${locName(loc)}:`;
    const byProd = {};
    groupItems.forEach((it) => {
      const p = products.find((x) => x.id === it.productId);
      if (!byProd[p.id]) byProd[p.id] = { name: p.name, um: p.um, qty: 0, stepQty: p.stepQty, packLabel: p.packLabel };
      byProd[p.id].qty += it.qty;
    });
    const lines = Object.values(byProd).map((r) => {
      const packSuffix = r.packLabel && r.stepQty && r.stepQty > 1
        ? ` (${r.qty / r.stepQty} x ${r.packLabel})` : "";
      return `- ${r.name} - ${r.qty} ${r.um}${packSuffix}`;
    });
    const dDate = groupItems.find((it) => it.deliveryDate)?.deliveryDate;
    const dLine = dDate ? `\nLivrare dorita: ${new Date(dDate + "T12:00").toLocaleDateString("ro-RO")}` : "";
    return `${header}\n\n${lines.join("\n")}${dLine}\n\nMultumim!`;
  };

  const openSendModal = (loc, supId, groupItems, queueRest = []) => {
    const sup = suppliers.find((s) => s.id === supId);
    const msg = buildOrderMsg(loc, supId, groupItems);
    const isGroup = sup.dest === "group";
    const url = isGroup ? null : `https://wa.me/${sup.phone}?text=${encodeURIComponent(msg)}`;
    setSendModal({ loc, supId, supName: sup.name, isGroup, msg, url, groupItems, queueRest });
  };

  const confirmSent = () => {
    if (!sendModal) return;
    const { loc, supId, supName, groupItems, queueRest } = sendModal;
    const orderRef = `${Date.now()}-${supId}-${loc}`;
    setItems((prev) => prev.map((it) => (groupItems.some((g) => g.id === it.id) ? { ...it, status: "trimis", sentTs: Date.now(), sentBy: me.id, orderRef } : it)));
    showToast(`Comanda ${supName} - ${locName(loc)} confirmata`);
    if (queueRest && queueRest.length) {
      const [next, ...rest] = queueRest;
      openSendModal(next.loc, next.sup, next.items, rest);
    } else {
      setSendModal(null);
    }
  };

  const cancelSend = () => { setSendModal(null); };

  const copyMsg = async (msg) => {
    try { await navigator.clipboard.writeText(msg); showToast("Mesaj copiat"); }
    catch (e) { showToast("Nu s-a putut copia - selecteaza manual"); }
  };

  const sendAll = () => {
    const groups = readyGroups.filter((g) => isApprover || (me && me.direct && me.locs.includes(g.loc)));
    if (!groups.length) { showToast("Nicio comanda de trimis"); return; }
    const [first, ...rest] = groups;
    openSendModal(first.loc, first.sup, first.items, rest);
  };

  const setReception = (orderRef, productId, qty) => {
    setReceptions((prev) => ({ ...prev, [orderRef]: { ...(prev[orderRef] || {}), [productId]: qty } }));
  };

  // ---------- FOAIE SOFER (printabil A4) ----------
  const printDriverSheet = (groups) => {
    const w = window.open("", "_blank");
    if (!w) { showToast("Permite pop-up pentru printare"); return; }
    const sections = groups.map((g) => {
      const sup = suppliers.find((s) => s.id === g.sup);
      const byProd = {};
      g.items.forEach((it) => {
        const p = products.find((x) => x.id === it.productId);
        if (!byProd[p.id]) byProd[p.id] = { name: p.name, um: p.um, qty: 0 };
        byProd[p.id].qty += it.qty;
      });
      const rows = Object.values(byProd).map((r) =>
        `<tr><td class="chk">[ ]</td><td>${r.name}</td><td class="qty">${r.qty} ${r.um}</td><td class="luat"></td></tr>`
      ).join("");
      return `<h2>${sup.name} - ${locName(g.loc)}</h2>
        <table><tr><th class="chk">X</th><th>Produs</th><th class="qty">Cantitate</th><th class="luat">Luat / Obs.</th></tr>${rows}</table>`;
    }).join("");
    w.document.write(`<html><head><title>Foaie sofer Turtha</title><style>
      body{font-family:Arial,sans-serif;padding:24px;color:#111}
      h1{font-size:18px;border-bottom:2px solid #111;padding-bottom:6px;margin-bottom:4px}
      .sub{font-size:12px;color:#555;margin-bottom:14px}
      h2{font-size:15px;margin:16px 0 6px}
      table{width:100%;border-collapse:collapse;margin-bottom:6px}
      td,th{border:1px solid #888;padding:6px 8px;font-size:13px;text-align:left}
      th{background:#eee}
      .chk{width:34px;text-align:center;font-size:16px}
      .qty{width:110px}
      .luat{width:130px}
      @media print { body{padding:8px} }
    </style></head><body>
      <h1>Foaie ridicare - Turtha</h1>
      <div class="sub">Generata: ${new Date().toLocaleString("ro-RO")} - de ${me.name}</div>
      ${sections}
    </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  };

  // ---------- PROPUNERI ----------
  const addProduct = () => {
    if (!newProd.name.trim()) return;
    if (!newProd.depts.length) { showToast("Bifeaza cel putin un departament"); return; }
    const pending = !isAdmin;
    const prodData = { ...newProd };
    if (!prodData.stepQty) delete prodData.stepQty;
    if (!prodData.minQty) delete prodData.minQty;
    if (!prodData.packLabel) delete prodData.packLabel;
    setDProducts((ps) => [...ps, { ...prodData, id: Math.max(0, ...ps.map((p) => p.id)) + 1, pending, proposedBy: me.id }]);
    setNewProd({ name: "", cat: "Bacanie", um: "kg", sup: "metro", depts: ["buc"], stepQty: "", minQty: "", packLabel: "" });
    showToast(pending ? "Propunere trimisa adminului (nesalvat)" : "Produs adaugat (nesalvat)");
  };

  const addLocation = () => {
    const id = newLoc.id.trim(); const name = newLoc.name.trim();
    if (!id || !name) { showToast("Completeaza codul si numele"); return; }
    if (dLocations.some((l) => l.id === id)) { showToast("Codul exista deja"); return; }
    const pending = !isAdmin;
    setDLocations((ls) => [...ls, { id, name, pending }]);
    setNewLoc({ id: "", name: "" });
    showToast(pending ? "Propunere trimisa adminului (nesalvat)" : "Locatie adaugata (nesalvat)");
  };

  const addUser = () => {
    if (!newUser.name.trim()) { showToast("Completeaza numele"); return; }
    if (!/^\d{4}$/.test(newUser.pin)) { showToast("PIN-ul trebuie sa aiba 4 cifre"); return; }
    if (dUsers.some((u) => u.pin === newUser.pin)) { showToast("PIN-ul exista deja - alege altul"); return; }
    if (!newUser.locs.length) { showToast("Bifeaza cel putin o locatie"); return; }
    if (!newUser.depts.length) { showToast("Bifeaza cel putin un departament"); return; }
    const pending = !(isAdmin || me.canAddUsers);
    setDUsers((us) => [...us, {
      ...newUser, id: Math.max(0, ...us.map((u) => u.id)) + 1, role: "angajat", direct: false, canAddUsers: false,
      approverId: newUser.approverId || (isAdmin ? null : me.id), pending,
    }]);
    setNewUser({ name: "", pin: "", depts: ["buc"], locs: [], approverId: null });
    showToast(pending ? "Propunere trimisa adminului (nesalvat)" : "Utilizator adaugat (nesalvat)");
  };

  const addSupplier = () => {
    if (!newSup.name.trim()) { showToast("Completeaza numele furnizorului"); return; }
    const baseId = newSup.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = baseId || ("sup" + Date.now());
    if (dSuppliers.some((x) => x.id === id)) { showToast("Exista deja un furnizor cu nume similar"); return; }
    setDSuppliers((ss) => [...ss, { id, name: newSup.name.trim(), phone: newSup.phone.trim(), days: newSup.days.trim(), pickup: newSup.pickup, dest: newSup.dest, active: true, templates: {} }]);
    setNewSup({ name: "", phone: "", days: "", pickup: false, dest: "phone" });
    showToast("Furnizor adaugat (nesalvat)");
  };

  // ---------- GRUPARE ----------
  const groupItems = (status, onlyMine = false) => {
    const map = {};
    items.filter((it) => it.status === status && (!onlyMine || canApproveItem(it))).forEach((it) => {
      const p = products.find((x) => x.id === it.productId);
      if (!p) return;
      const key = `${it.loc}|${p.sup}`;
      if (!map[key]) map[key] = { loc: it.loc, sup: p.sup, items: [] };
      map[key].items.push(it);
    });
    return Object.values(map);
  };

  // cantitate deja in comenzi deschise pentru produs, pe locatia activa
  const openQty = (productId) => items
    .filter((it) => it.productId === productId && it.loc === activeLoc && (it.status === "in_aprobare" || it.status === "de_trimis"))
    .reduce((a, b) => a + b.qty, 0);

  const myProducts = me ? products.filter((p) => !p.pending && p.depts.includes(activeDept)) : [];
  const cats = useMemo(() => ["Toate", ...Array.from(new Set(myProducts.map((p) => p.cat)))], [products, activeDept, currentUserId]);
  const mySuppliers = Array.from(new Set(myProducts.map((p) => p.sup)));
  const visibleProducts = myProducts.filter((p) =>
    (catFilter === "Toate" || p.cat === catFilter) &&
    (supFilter === "toti" || p.sup === supFilter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ---------- COMPONENTE ----------
  const Badge = ({ loc }) => (
    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-stone-800 text-stone-100 tracking-wider">{loc}</span>
  );

  const ProductBreakdown = ({ groupList }) => (
    <div className="mt-1 ml-2 border-l-2 border-dashed border-stone-300 pl-3 space-y-1">
      {groupList.map((it) => {
        const u = users.find((x) => x.id === it.userId);
        const d = deptOf(it.dept);
        const p = products.find((x) => x.id === it.productId);
        return (
          <div key={it.id} className="flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className={`px-1.5 py-0.5 rounded-full ${d.color}`}>{d.name}</span>
              <span>{u ? u.name : "?"}</span>
            </span>
            <span className="font-mono">{it.qty} {p.um}</span>
          </div>
        );
      })}
    </div>
  );

  const OrderCard = ({ group, mode }) => {
    const sup = suppliers.find((s) => s.id === group.sup);
    const byProd = {};
    group.items.forEach((it) => {
      if (!byProd[it.productId]) byProd[it.productId] = [];
      byProd[it.productId].push(it);
    });
    const canSendThis = isApprover || (me && me.direct && me.locs.includes(group.loc));
    const dDate = group.items.find((it) => it.deliveryDate)?.deliveryDate;
    return (
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden mb-3">
        <div className="px-4 py-3 flex items-center justify-between border-b border-dashed border-stone-300 bg-stone-50">
          <div>
            <div className="font-bold text-stone-900">{sup.name}</div>
            <div className="text-xs text-stone-500">{sup.days}</div>
            {dDate && <div className="text-xs text-emerald-700 font-medium">Livrare dorita: {new Date(dDate + "T12:00").toLocaleDateString("ro-RO")}</div>}
          </div>
          <Badge loc={group.loc} />
        </div>
        <div className="px-4 py-2 divide-y divide-stone-100">
          {Object.entries(byProd).map(([pid, list]) => {
            const p = products.find((x) => x.id === Number(pid));
            const total = list.reduce((a, b) => a + b.qty, 0);
            const key = `${mode}-${group.loc}-${group.sup}-${pid}`;
            return (
              <div key={pid} className="py-2">
                <button className="w-full flex items-center justify-between text-left"
                  onClick={() => setExpanded((e) => ({ ...e, [key]: !e[key] }))}>
                  <span className="text-sm text-stone-800">{p.name}</span>
                  <span className="font-mono text-sm font-semibold text-stone-900">
                    {total} {p.um} <span className="text-stone-400 ml-1">{expanded[key] ? "v" : ">"}</span>
                  </span>
                </button>
                {expanded[key] && (
                  <div>
                    <ProductBreakdown groupList={list} />
                    {mode === "editabil" && (
                      <div className="mt-2 ml-2 pl-3 space-y-1">
                        {list.map((it) => {
                          const pp = products.find((x) => x.id === it.productId);
                          const step = pp?.stepQty || 1;
                          const editable = canEditPending(it);
                          const modifier = it.modifiedBy ? users.find((x) => x.id === it.modifiedBy) : null;
                          return (
                            <div key={it.id} className="flex items-center gap-2 text-xs flex-wrap">
                              {editable ? (
                                <>
                                  <span className="text-stone-500">modifica:</span>
                                  <button onClick={() => editPendingQty(it.id, -1)} className="w-6 h-6 rounded bg-stone-200 font-bold">-</button>
                                  <span className="font-mono w-14 text-center">{it.qty} {pp?.um}</span>
                                  <button onClick={() => editPendingQty(it.id, +1)} className="w-6 h-6 rounded bg-stone-200 font-bold">+</button>
                                  {step > 1 && <span className="text-stone-400">pas: {step}</span>}
                                  <button onClick={() => deletePendingItem(it.id)} className="ml-1 px-2 h-6 rounded bg-red-100 text-red-700 font-semibold">sterge</button>
                                </>
                              ) : (
                                <span className="text-stone-400">blocat (trimis spre aprobare)</span>
                              )}
                              {modifier && <span className="text-[10px] text-stone-400 w-full">modificat de {modifier.name} la {fmtDate(it.modifiedAt)}</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {mode === "aprobare" && isApprover && (
                      <div className="mt-2 ml-2 pl-3 space-y-1">
                        {list.map((it) => {
                          const pp = products.find((x) => x.id === it.productId);
                          const step = pp?.stepQty || 1;
                          return (
                            <div key={it.id} className="flex items-center gap-2 text-xs">
                              <span className="text-stone-500">ajusteaza:</span>
                              <button onClick={() => updateQty(it.id, -1)} className="w-6 h-6 rounded bg-stone-200 font-bold">-</button>
                              <span className="font-mono w-14 text-center">{it.qty} {pp?.um}</span>
                              <button onClick={() => updateQty(it.id, +1)} className="w-6 h-6 rounded bg-stone-200 font-bold">+</button>
                              {step > 1 && <span className="text-stone-400">pas: {step}</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-100">
          {mode === "aprobare" && isApprover && (
            <button onClick={() => approveGroup(group.loc, group.sup)} className="w-full py-2.5 rounded-lg bg-stone-900 text-white font-semibold text-sm">
              Aproba comanda
            </button>
          )}
          {mode === "de_trimis" && (canSendThis ? (
            <div className="flex gap-2">
              <button onClick={() => openSendModal(group.loc, group.sup, group.items)} className="flex-1 py-2.5 rounded-lg text-white font-semibold text-sm" style={{ background: "#1FAF54" }}>
                WhatsApp catre {sup.name}
              </button>
              <button onClick={() => printDriverSheet([group])} className="px-3 py-2.5 rounded-lg bg-stone-200 text-stone-700 font-semibold text-sm">Print</button>
            </div>
          ) : (
            <div className="text-xs text-center text-stone-500">Doar un aprobator poate trimite aceasta comanda</div>
          ))}
        </div>
      </div>
    );
  };

  // istoric: comenzi trimise grupate pe orderRef, cumulate pe produs, cu receptie
  const SentOrderCard = ({ orderRef, list }) => {
    const first = list[0];
    const p0 = products.find((x) => x.id === first.productId);
    const sup = suppliers.find((s) => s.id === p0?.sup);
    const sender = users.find((u) => u.id === first.sentBy);
    const byProd = {};
    list.forEach((it) => {
      const p = products.find((x) => x.id === it.productId);
      if (!byProd[p.id]) byProd[p.id] = { p, qty: 0 };
      byProd[p.id].qty += it.qty;
    });
    const rec = receptions[orderRef] || {};
    const prods = Object.values(byProd);
    const recStatus = prods.every((r) => rec[r.p.id] === r.qty) ? "complet"
      : prods.some((r) => rec[r.p.id] != null) ? "partial" : null;
    const canReceive = isApprover || me.locs.includes(first.loc);
    const key = `hist-${orderRef}`;
    return (
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-2">
        <button className="w-full px-4 py-3 flex items-center justify-between text-left"
          onClick={() => setExpanded((e) => ({ ...e, [key]: !e[key] }))}>
          <div>
            <div className="font-semibold text-stone-900 text-sm">{sup?.name} <span className="text-stone-400">-</span> {locName(first.loc)}</div>
            <div className="text-xs text-stone-500">{fmtDate(first.sentTs)} - trimisa de {sender?.name || "?"} - {prods.length} produse</div>
          </div>
          <div className="flex items-center gap-2">
            {recStatus === "complet" && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">receptionat</span>}
            {recStatus === "partial" && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">partial</span>}
            <span className="text-stone-400">{expanded[key] ? "v" : ">"}</span>
          </div>
        </button>
        {expanded[key] && (
          <div className="px-4 pb-3 divide-y divide-stone-100">
            {prods.map(({ p, qty }) => (
              <div key={p.id} className="py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm text-stone-800">{p.name}</div>
                  <div className="text-xs text-stone-500">comandat: <span className="font-mono font-semibold">{qty} {p.um}</span></div>
                </div>
                {canReceive && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input type="number" min="0" placeholder="primit" value={rec[p.id] ?? ""}
                      onChange={(e) => setReception(orderRef, p.id, e.target.value === "" ? undefined : Math.max(0, Number(e.target.value)))}
                      className="w-16 text-center font-mono text-sm border border-stone-300 rounded-lg py-1" />
                    <button onClick={() => setReception(orderRef, p.id, qty)}
                      className={`text-xs px-2 py-1.5 rounded-lg font-semibold ${rec[p.id] === qty ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"}`}>OK tot</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ---------- LOGIN ----------
  if (!me) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#EFF1EC", fontFamily: "ui-sans-serif, system-ui" }}>
        <div className="px-6 pt-12 pb-8" style={{ background: "#22402F" }}>
          <div className="text-emerald-200 text-xs font-mono tracking-[0.25em] uppercase">Turtha</div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Necesar</h1>
          <p className="text-emerald-100/70 text-sm mt-1">Comenzi catre furnizori, pe locatii</p>
        </div>
        <div className="p-6 flex flex-col items-center mt-6">
          <div className="text-sm text-stone-600 mb-4 font-medium">Introdu PIN-ul tau</div>
          <input autoFocus type="password" inputMode="numeric" maxLength={4} value={pinInput}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
              setPinInput(v);
              if (v.length === 4) tryLogin(v);
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && pinInput.length === 4) tryLogin(); }}
            className="text-center text-3xl tracking-[0.5em] font-mono w-48 px-3 py-4 rounded-2xl border-2 border-stone-300 bg-white mb-4" />
          <button onClick={() => tryLogin()} disabled={pinInput.length !== 4}
            className={`w-48 py-3 rounded-2xl font-bold text-white ${pinInput.length === 4 ? "" : "opacity-40"}`} style={{ background: "#22402F" }}>
            Intra
          </button>
        </div>
      </div>
    );
  }

  // ---------- CONTINUT ----------
  const cartCount = Object.values(cart).filter((q) => q > 0).length;
  const pendingGroups = groupItems("in_aprobare", true);
  const allPendingGroups = groupItems("in_aprobare");
  const readyGroups = groupItems("de_trimis");

  // istoric grupat pe comenzi (orderRef)
  const sentByOrder = {};
  items.filter((it) => it.status === "trimis").forEach((it) => {
    const ref = it.orderRef || `legacy-${it.id}`;
    if (!sentByOrder[ref]) sentByOrder[ref] = [];
    sentByOrder[ref].push(it);
  });
  const sentOrders = Object.entries(sentByOrder)
    .filter(([ref, list]) => {
      const p0 = products.find((x) => x.id === list[0].productId);
      if (histSup !== "toti" && p0?.sup !== histSup) return false;
      if (histDay && fmtDay(list[0].sentTs) !== fmtDay(new Date(histDay + "T12:00").getTime())) return false;
      if (histSearch) {
        const q = histSearch.toLowerCase();
        const hit = list.some((it) => products.find((x) => x.id === it.productId)?.name.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (!isApprover) {
        const mine = list.some((it) => it.userId === me.id || me.locs.includes(it.loc));
        if (!mine) return false;
      }
      return true;
    })
    .sort((a, b) => b[1][0].sentTs - a[1][0].sentTs);

  const proposalsCount = isAdmin ? (products.filter((p) => p.pending).length + locations.filter((l) => l.pending).length + users.filter((u) => u.pending).length) : 0;

  const tabs = [
    { id: "necesar", label: "Necesar" },
    { id: "comenzi", label: `De trimis${readyGroups.length ? ` (${readyGroups.length})` : ""}` },
    ...(isApprover ? [{ id: "aprobare", label: `Aprobare${pendingGroups.length ? ` (${pendingGroups.length})` : ""}` }] : []),
    { id: "istoric", label: "Istoric" },
    ...(isApprover || me.canAddUsers ? [{ id: "admin", label: isAdmin ? `Admin${proposalsCount ? ` (${proposalsCount})` : ""}` : "Gestiune" }] : []),
  ];

  const approverOptions = users.filter((u) => !u.pending && (u.role === "aprobator" || u.role === "admin"));
  const adminViews = isAdmin ? ["utilizatori", "nomenclator", "locatii", "furnizori"] : isApprover ? ["utilizatori", "nomenclator", "locatii"] : ["utilizatori"];

  return (
    <div className="min-h-screen pb-24" style={{ background: "#EFF1EC", fontFamily: "ui-sans-serif, system-ui" }}>
      {/* HEADER */}
      <div className="px-4 pt-5 pb-3 sticky top-0 z-20" style={{ background: "#22402F" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-emerald-200 text-[10px] font-mono tracking-[0.25em] uppercase">Turtha - Necesar</div>
            <div className="text-white font-bold flex items-center gap-2 mt-0.5 flex-wrap">
              {me.name}
              {me.depts.length > 1 ? (
                <select value={activeDept} onChange={(e) => setActiveDept(e.target.value)}
                  className="text-[11px] font-semibold bg-stone-800 text-stone-100 rounded-full px-2 py-0.5 border-0">
                  {me.depts.map((d) => <option key={d} value={d}>{deptOf(d).name}</option>)}
                </select>
              ) : (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${deptOf(activeDept).color}`}>{deptOf(activeDept).name}</span>
              )}
              {me.locs.length > 1 ? (
                <select value={activeLoc} onChange={(e) => setActiveLoc(e.target.value)}
                  className="text-[11px] font-mono font-bold bg-stone-800 text-stone-100 rounded px-1.5 py-0.5 border-0">
                  {me.locs.map((l) => <option key={l} value={l}>{l} - {locName(l)}</option>)}
                </select>
              ) : (
                <Badge loc={me.locs[0]} />
              )}
            </div>
          </div>
          <button onClick={() => leaveAdminGuard(logout)} className="text-emerald-200 text-xs underline">iesi</button>
        </div>
        <div className="flex gap-1.5 mt-3 overflow-x-auto -mx-1 px-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => leaveAdminGuard(() => setTab(t.id))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${tab === t.id ? "bg-white text-stone-900" : "bg-white/15 text-emerald-50"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* NECESAR */}
        {tab === "necesar" && (
          <div>
            <div className="flex gap-2 mb-2">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cauta produs..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm min-w-0" />
              <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
                title="Data livrarii (optional)"
                className="px-2 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-600" />
            </div>
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
              <select value={supFilter} onChange={(e) => setSupFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2 py-2 bg-white shrink-0">
                <option value="toti">Toti furnizorii</option>
                {mySuppliers.map((sid) => <option key={sid} value={sid}>{suppliers.find((s) => s.id === sid)?.name || sid}</option>)}
              </select>
              {me.depts.length > 1 && (
                <select value={activeDept} onChange={(e) => setActiveDept(e.target.value)}
                  className="text-xs border border-stone-300 rounded-lg px-2 py-2 bg-white shrink-0">
                  {me.depts.map((d) => <option key={d} value={d}>{deptOf(d).name}</option>)}
                </select>
              )}
              {me.locs.length > 1 && (
                <select value={activeLoc} onChange={(e) => setActiveLoc(e.target.value)}
                  className="text-xs border border-stone-300 rounded-lg px-2 py-2 bg-white shrink-0 font-mono font-bold">
                  {me.locs.map((l) => <option key={l} value={l}>{l} - {locName(l)}</option>)}
                </select>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-1">
              {cats.map((c) => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${catFilter === c ? "bg-stone-900 text-white" : "bg-white border border-stone-300 text-stone-600"}`}>{c}</button>
              ))}
            </div>
            <div className="space-y-1.5">
              {visibleProducts.map((p) => {
                const sup = suppliers.find((s) => s.id === p.sup);
                const q = cart[p.id] || 0;
                const already = openQty(p.id);
                const step = p.stepQty || 1;
                const handleInc = () => setCart((c) => {
                  const cur = c[p.id] || 0;
                  if (cur === 0) return { ...c, [p.id]: p.minQty || step };
                  return { ...c, [p.id]: cur + step };
                });
                const handleDec = () => setCart((c) => {
                  const cur = c[p.id] || 0;
                  return { ...c, [p.id]: Math.max(0, cur - step) };
                });
                const handleInput = (val) => {
                  const n = Math.max(0, Number(val) || 0);
                  if (n === 0) { setCart((c) => ({ ...c, [p.id]: 0 })); return; }
                  const snapped = validQty(n, p);
                  if (step > 1 && n !== snapped) showToast(`se comanda doar la multiplu de ${step} ${p.um}`);
                  setCart((c) => ({ ...c, [p.id]: snapped }));
                };
                return (
                  <div key={p.id} className={`bg-white rounded-xl border px-3 py-2.5 flex items-center justify-between ${q > 0 ? "border-emerald-600 ring-1 ring-emerald-600" : "border-stone-200"}`}>
                    <div className="min-w-0 pr-2">
                      <div className="text-sm font-medium text-stone-900 truncate">{p.name}</div>
                      <div className="text-xs text-stone-500">{sup?.name} - {p.cat}</div>
                      {p.packLabel && <div className="text-[11px] text-stone-400">se comanda la: {p.packLabel}</div>}
                      {!p.packLabel && step > 1 && <div className="text-[11px] text-stone-400">multiplu de {step} {p.um}</div>}
                      {already > 0 && (
                        <div className="text-[11px] text-amber-700 font-medium">deja in comanda: {already} {p.um}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={handleDec}
                        className="w-8 h-8 rounded-lg bg-stone-100 font-bold text-stone-700">-</button>
                      <div className="w-14 text-center">
                        <input type="number" min="0" value={q || ""} placeholder="0"
                          onChange={(e) => handleInput(e.target.value)}
                          className="w-12 text-center font-mono text-sm border border-stone-200 rounded py-1" />
                        <div className="text-[10px] text-stone-400">{p.um}</div>
                      </div>
                      <button onClick={handleInc}
                        className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold">+</button>
                    </div>
                  </div>
                );
              })}
              {visibleProducts.length === 0 && (
                <div className="text-center text-sm text-stone-500 py-10">Niciun produs pentru departamentul ales in aceasta categorie.</div>
              )}
            </div>
          </div>
        )}

        {/* DE TRIMIS */}
        {tab === "comenzi" && (
          <div>
            {readyGroups.some((g) => isApprover || (me && me.direct && me.locs.includes(g.loc))) && (
              <button onClick={sendAll}
                className="w-full mb-3 py-3 rounded-xl text-white font-bold text-sm" style={{ background: "#1FAF54" }}>
                Trimite toate comenzile ({readyGroups.filter((g) => isApprover || (me && me.direct && me.locs.includes(g.loc))).length})
              </button>
            )}
            {readyGroups.length > 1 && (
              <button onClick={() => printDriverSheet(readyGroups)}
                className="w-full mb-3 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-semibold text-sm">
                Print Foaie sofer - toate comenzile ({readyGroups.length})
              </button>
            )}
            {readyGroups.length === 0 && <div className="text-center text-sm text-stone-500 py-12">Nicio comanda de trimis. Adauga produse din tabul Necesar.</div>}
            {readyGroups.map((g) => <OrderCard key={`${g.loc}-${g.sup}`} group={g} mode="de_trimis" />)}
            {allPendingGroups.length > 0 && !isApprover && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">In asteptarea aprobarii</div>
                {allPendingGroups.map((g) => <OrderCard key={`p-${g.loc}-${g.sup}`} group={g} mode="editabil" />)}
              </div>
            )}
          </div>
        )}

        {/* APROBARE */}
        {tab === "aprobare" && isApprover && (
          <div>
            {pendingGroups.length === 0 && <div className="text-center text-sm text-stone-500 py-12">Nimic de aprobat de la oamenii tai. OK</div>}
            {pendingGroups.map((g) => <OrderCard key={`a-${g.loc}-${g.sup}`} group={g} mode="aprobare" />)}
          </div>
        )}

        {/* ISTORIC */}
        {tab === "istoric" && (
          <div>
            <div className="flex gap-2 mb-3">
              <select value={histSup} onChange={(e) => setHistSup(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2 py-2 bg-white">
                <option value="toti">Toti furnizorii</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input value={histSearch} onChange={(e) => setHistSearch(e.target.value)} placeholder="Cauta produs..."
                className="flex-1 px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs min-w-0" />
              <input type="date" value={histDay} onChange={(e) => setHistDay(e.target.value)}
                className="px-2 py-2 rounded-lg border border-stone-300 bg-white text-xs text-stone-600" />
            </div>
            {sentOrders.length === 0 && <div className="text-center text-sm text-stone-500 py-12">Nicio comanda gasita.</div>}
            {sentOrders.map(([ref, list]) => <SentOrderCard key={ref} orderRef={ref} list={list} />)}
          </div>
        )}

        {/* ADMIN / GESTIUNE */}
        {tab === "admin" && (isApprover || me.canAddUsers) && (
          <div>
            {adminDirty && (
              <div className="sticky top-16 z-10 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 mb-3 flex items-center gap-2 shadow-sm">
                <span className="text-xs text-amber-800 font-semibold flex-1">Ai modificari nesalvate</span>
                <button onClick={discardAdmin} className="text-xs px-3 py-1.5 rounded-lg bg-stone-200 text-stone-700 font-semibold">Renunta</button>
                <button onClick={saveAdmin} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold">Salveaza</button>
              </div>
            )}
            <div className="flex gap-1.5 mb-3 overflow-x-auto">
              {adminViews.map((v) => (
                <button key={v} onClick={() => setAdminView(v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${adminView === v ? "bg-stone-900 text-white" : "bg-white border border-stone-300 text-stone-600"}`}>{v}</button>
              ))}
            </div>
            {!isAdmin && isApprover && <div className="text-[11px] text-stone-500 mb-3">Produsele si locatiile propuse intra in vigoare dupa aprobarea adminului. Utilizatorii noi intra direct daca ai dreptul de adaugare.</div>}

            {adminView === "utilizatori" && (
              <div className="space-y-2">
                <div className="bg-white rounded-xl border border-stone-200 p-3">
                  <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">Adauga utilizator</div>
                  <div className="flex gap-2 mb-2">
                    <input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Nume"
                      className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-sm min-w-0" />
                    <input value={newUser.pin} onChange={(e) => setNewUser({ ...newUser, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="PIN" inputMode="numeric" className="w-20 px-2 py-2 rounded-lg border border-stone-300 text-sm font-mono text-center" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Departamente:</span>
                    {DEPTS.map((d) => (
                      <button key={d.id} onClick={() => setNewUser((nu) => ({ ...nu, depts: nu.depts.includes(d.id) ? nu.depts.filter((x) => x !== d.id) : [...nu.depts, d.id] }))}
                        className={`text-xs px-2 py-1 rounded-full ${newUser.depts.includes(d.id) ? d.color + " ring-1 ring-stone-400 font-semibold" : "bg-stone-100 text-stone-400"}`}>{d.name}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Locatii:</span>
                    {dActiveLocations.map((l) => (
                      <button key={l.id} onClick={() => setNewUser((nu) => ({ ...nu, locs: nu.locs.includes(l.id) ? nu.locs.filter((x) => x !== l.id) : [...nu.locs, l.id] }))}
                        className={`text-xs px-2 py-1 rounded-lg font-mono font-bold ${newUser.locs.includes(l.id) ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"}`}>{l.id}</button>
                    ))}
                  </div>
                  <select value={newUser.approverId || ""} onChange={(e) => setNewUser({ ...newUser, approverId: Number(e.target.value) || null })}
                    className="w-full text-xs border border-stone-300 rounded-lg px-2 py-2 bg-white mb-2">
                    <option value="">Aprobator (responsabil)...</option>
                    {approverOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                  <button onClick={addUser} className="w-full py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold">
                    {(isAdmin || me.canAddUsers) ? "Adauga" : "Propune adminului"}
                  </button>
                </div>
                {dUsers.map((u) => (
                  <div key={u.id} className={`bg-white rounded-xl border p-3 ${u.pending ? "border-amber-400" : "border-stone-200"}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-stone-900 flex items-center gap-2">
                        {u.name}
                        {u.pending && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">asteapta admin</span>}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {u.depts.map((d) => <span key={d} className={`text-[10px] px-1.5 py-0.5 rounded-full ${deptOf(d).color}`}>{deptOf(d).name}</span>)}
                        {u.locs.map((l) => <Badge key={l} loc={l} />)}
                      </div>
                    </div>
                    {u.pending && isAdmin && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => setDUsers((us) => us.map((x) => x.id === u.id ? { ...x, pending: false } : x))}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold">Aproba</button>
                        <button onClick={() => setDUsers((us) => us.filter((x) => x.id !== u.id))}
                          className="flex-1 py-1.5 rounded-lg bg-stone-200 text-stone-700 text-xs font-semibold">Respinge</button>
                      </div>
                    )}
                    {isAdmin && !u.pending && (
                      <div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <select value={u.role} onChange={(e) => setDUsers((us) => us.map((x) => x.id === u.id ? { ...x, role: e.target.value } : x))}
                            className="text-xs border border-stone-300 rounded-lg px-2 py-1.5 bg-white">
                            <option value="angajat">Angajat</option>
                            <option value="aprobator">Aprobator</option>
                            <option value="admin">Admin</option>
                          </select>
                          <select value={u.approverId || ""} onChange={(e) => setDUsers((us) => us.map((x) => x.id === u.id ? { ...x, approverId: Number(e.target.value) || null } : x))}
                            className="text-xs border border-stone-300 rounded-lg px-2 py-1.5 bg-white">
                            <option value="">Fara aprobator</option>
                            {approverOptions.filter((a) => a.id !== u.id).map((a) => <option key={a.id} value={a.id}>catre {a.name}</option>)}
                          </select>
                          <button onClick={() => setDUsers((us) => us.map((x) => x.id === u.id ? { ...x, direct: !x.direct } : x))}
                            className={`text-xs px-2 py-1.5 rounded-lg font-semibold ${u.direct ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"}`}>
                            {u.direct ? "OK Trimite direct" : "Necesita aprobare"}
                          </button>
                          <button onClick={() => setDUsers((us) => us.map((x) => x.id === u.id ? { ...x, canAddUsers: !x.canAddUsers } : x))}
                            className={`text-xs px-2 py-1.5 rounded-lg font-semibold ${u.canAddUsers ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500"}`}>
                            {u.canAddUsers ? "OK Adauga utilizatori" : "Nu adauga utilizatori"}
                          </button>
                          <button onClick={() => {
                            setDevices((prev) => Object.fromEntries(Object.entries(prev).filter(([, uid]) => uid !== u.id)));
                            showToast(`Dispozitiv resetat pentru ${u.name}`);
                          }}
                            disabled={!Object.values(devices).includes(u.id)}
                            className={`text-xs px-2 py-1.5 rounded-lg font-semibold ${Object.values(devices).includes(u.id) ? "bg-red-100 text-red-700" : "bg-stone-100 text-stone-300"}`}>
                            {Object.values(devices).includes(u.id) ? "Reseteaza dispozitiv" : "Fara dispozitiv"}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Dept:</span>
                          {DEPTS.map((d) => (
                            <button key={d.id} onClick={() => setDUsers((us) => us.map((x) => {
                              if (x.id !== u.id) return x;
                              const has = x.depts.includes(d.id);
                              if (has && x.depts.length === 1) return x;
                              return { ...x, depts: has ? x.depts.filter((y) => y !== d.id) : [...x.depts, d.id] };
                            }))}
                              className={`text-xs px-2 py-0.5 rounded-full ${u.depts.includes(d.id) ? d.color + " ring-1 ring-stone-400 font-semibold" : "bg-stone-100 text-stone-400"}`}>{d.name}</button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Locatii:</span>
                          {dActiveLocations.map((l) => (
                            <button key={l.id} onClick={() => setDUsers((us) => us.map((x) => {
                              if (x.id !== u.id) return x;
                              const has = x.locs.includes(l.id);
                              if (has && x.locs.length === 1) return x;
                              return { ...x, locs: has ? x.locs.filter((y) => y !== l.id) : [...x.locs, l.id] };
                            }))}
                              className={`text-xs px-2 py-1 rounded-lg font-mono font-bold ${u.locs.includes(l.id) ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-400"}`}>{l.id}</button>
                          ))}
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold ml-2">PIN:</span>
                          <input value={u.pin} onChange={(e) => setDUsers((us) => us.map((x) => x.id === u.id ? { ...x, pin: e.target.value.replace(/\D/g, "").slice(0, 4) } : x))}
                            className="w-16 px-2 py-1 rounded-lg border border-stone-300 text-xs font-mono text-center" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {adminView === "nomenclator" && isApprover && (
              <div>
                <div className="bg-white rounded-xl border border-stone-200 p-3 mb-3">
                  <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">Adauga produs</div>
                  <input value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} placeholder="Nume produs"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mb-2" />
                  <div className="flex gap-2 mb-2">
                    <input value={newProd.cat} onChange={(e) => setNewProd({ ...newProd, cat: e.target.value })} placeholder="Categorie"
                      className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-sm min-w-0" />
                    <input value={newProd.um} onChange={(e) => setNewProd({ ...newProd, um: e.target.value })} placeholder="UM"
                      className="w-16 px-2 py-2 rounded-lg border border-stone-300 text-sm" />
                    <select value={newProd.sup} onChange={(e) => setNewProd({ ...newProd, sup: e.target.value })}
                      className="px-2 py-2 rounded-lg border border-stone-300 text-sm bg-white">
                      {dSuppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Vizibil pentru:</span>
                    {DEPTS.map((d) => (
                      <button key={d.id} onClick={() => setNewProd((np) => ({ ...np, depts: np.depts.includes(d.id) ? np.depts.filter((x) => x !== d.id) : [...np.depts, d.id] }))}
                        className={`text-xs px-2 py-1 rounded-full ${newProd.depts.includes(d.id) ? d.color + " ring-1 ring-stone-400 font-semibold" : "bg-stone-100 text-stone-400"}`}>{d.name}</button>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-1">Pas comanda</div>
                      <input type="number" min="1" value={newProd.stepQty} onChange={(e) => setNewProd({ ...newProd, stepQty: e.target.value ? Number(e.target.value) : "" })}
                        placeholder="ex: 5" className="w-full px-2 py-2 rounded-lg border border-stone-300 text-sm" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-1">Min comanda</div>
                      <input type="number" min="0" value={newProd.minQty} onChange={(e) => setNewProd({ ...newProd, minQty: e.target.value ? Number(e.target.value) : "" })}
                        placeholder="ex: 5" className="w-full px-2 py-2 rounded-lg border border-stone-300 text-sm" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-1">Ambalaj</div>
                      <input value={newProd.packLabel} onChange={(e) => setNewProd({ ...newProd, packLabel: e.target.value })}
                        placeholder="ex: bidon 5 l" className="w-full px-2 py-2 rounded-lg border border-stone-300 text-sm" />
                    </div>
                  </div>
                  <button onClick={addProduct} className="w-full py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold">
                    {isAdmin ? "Adauga" : "Propune adminului"}
                  </button>
                </div>
                <div className="space-y-1">
                  {dProducts.map((p) => (
                    <div key={p.id} className={`bg-white rounded-lg border px-3 py-2 ${p.pending ? "border-amber-400" : "border-stone-200"}`}>
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <div className="text-sm text-stone-800 flex items-center gap-1.5 flex-wrap">
                            {p.name}
                            {p.pending && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">asteapta admin</span>}
                          </div>
                          <div className="text-xs text-stone-500">{dSuppliers.find((s) => s.id === p.sup)?.name} - {p.cat} - {p.um} - {(p.depts || ALLD).map((d) => deptOf(d).name).join(", ")}</div>
                        </div>
                        {isAdmin && !p.pending && (
                          <button onClick={() => setDProducts((ps) => ps.filter((x) => x.id !== p.id))} className="text-xs text-red-500 shrink-0">sterge</button>
                        )}
                      </div>
                      {p.pending && isAdmin && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => setDProducts((ps) => ps.map((x) => x.id === p.id ? { ...x, pending: false } : x))}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold">Aproba</button>
                          <button onClick={() => setDProducts((ps) => ps.filter((x) => x.id !== p.id))}
                            className="flex-1 py-1.5 rounded-lg bg-stone-200 text-stone-700 text-xs font-semibold">Respinge</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminView === "locatii" && isApprover && (
              <div>
                <div className="bg-white rounded-xl border border-stone-200 p-3 mb-3">
                  <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">Adauga locatie / zona</div>
                  <div className="flex gap-2 mb-2">
                    <input value={newLoc.id} onChange={(e) => setNewLoc({ ...newLoc, id: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) })}
                      placeholder="Cod" className="w-20 px-2 py-2 rounded-lg border border-stone-300 text-sm font-mono" />
                    <input value={newLoc.name} onChange={(e) => setNewLoc({ ...newLoc, name: e.target.value })}
                      placeholder="Nume (ex. Productie Patiserie)" className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-sm min-w-0" />
                  </div>
                  <button onClick={addLocation} className="w-full py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold">
                    {isAdmin ? "Adauga" : "Propune adminului"}
                  </button>
                  <div className="text-[11px] text-stone-400 mt-2">Poate fi si o zona interna sau un client B2B: Productie Patiserie, Cafenea X etc.</div>
                </div>
                <div className="space-y-1">
                  {dLocations.map((l) => {
                    const inUse = dUsers.some((u) => u.locs.includes(l.id));
                    return (
                      <div key={l.id} className={`bg-white rounded-lg border px-3 py-2.5 ${l.pending ? "border-amber-400" : "border-stone-200"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge loc={l.id} />
                            <span className="text-sm text-stone-800">{l.name}</span>
                            {l.pending && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">asteapta admin</span>}
                          </div>
                          {isAdmin && !l.pending && (inUse ? (
                            <span className="text-[11px] text-stone-400">are utilizatori - muta-i intai</span>
                          ) : (
                            <button onClick={() => setDLocations((ls) => ls.filter((x) => x.id !== l.id))} className="text-xs text-red-500">sterge</button>
                          ))}
                        </div>
                        {l.pending && isAdmin && (
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => setDLocations((ls) => ls.map((x) => x.id === l.id ? { ...x, pending: false } : x))}
                              className="flex-1 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold">Aproba</button>
                            <button onClick={() => setDLocations((ls) => ls.filter((x) => x.id !== l.id))}
                              className="flex-1 py-1.5 rounded-lg bg-stone-200 text-stone-700 text-xs font-semibold">Respinge</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {adminView === "furnizori" && isAdmin && (
              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-stone-200 p-3">
                  <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">Adauga furnizor</div>
                  <div className="flex gap-2 mb-2">
                    <input value={newSup.name} onChange={(e) => setNewSup({ ...newSup, name: e.target.value })} placeholder="Nume furnizor"
                      className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-sm min-w-0" />
                    <input value={newSup.phone} onChange={(e) => setNewSup({ ...newSup, phone: e.target.value.replace(/[^0-9]/g, "") })} placeholder="Telefon (40...)"
                      className="w-36 px-2 py-2 rounded-lg border border-stone-300 text-sm font-mono" />
                  </div>
                  <input value={newSup.days} onChange={(e) => setNewSup({ ...newSup, days: e.target.value })} placeholder="Zile comanda / note"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mb-2" />
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <button onClick={() => setNewSup({ ...newSup, dest: newSup.dest === "group" ? "phone" : "group" })}
                      className={`text-[11px] px-2 py-1 rounded-lg font-semibold ${newSup.dest === "group" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}>
                      {newSup.dest === "group" ? "grup WhatsApp (copy)" : "numar direct"}</button>
                    <button onClick={() => setNewSup({ ...newSup, pickup: !newSup.pickup })}
                      className={`text-[11px] px-2 py-1 rounded-lg font-semibold ${newSup.pickup ? "bg-blue-100 text-blue-800" : "bg-stone-100 text-stone-500"}`}>
                      {newSup.pickup ? "ridicare sofer" : "livrare furnizor"}</button>
                  </div>
                  <button onClick={addSupplier} className="w-full py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold">Adauga furnizor</button>
                </div>
                {dSuppliers.map((s) => (
                  <div key={s.id} className="bg-white rounded-xl border border-stone-200 p-3">
                    <div className="font-semibold text-stone-900 mb-1 flex items-center gap-2">
                      {s.name}
                      <button onClick={() => setDSuppliers((ss) => ss.map((x) => x.id === s.id ? { ...x, pickup: !x.pickup } : x))}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${s.pickup ? "bg-blue-100 text-blue-800" : "bg-stone-100 text-stone-400"}`}>
                        {s.pickup ? "Transport ridicare sofer" : "livrare furnizor"}
                      </button>
                      <button onClick={() => setDSuppliers((ss) => ss.map((x) => x.id === s.id ? { ...x, dest: x.dest === "group" ? "phone" : "group" } : x))}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${s.dest === "group" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}>
                        {s.dest === "group" ? "grup WhatsApp (copy)" : "numar direct"}
                      </button>
                      <button onClick={() => setDSuppliers((ss) => ss.map((x) => x.id === s.id ? { ...x, active: x.active === false ? true : false } : x))}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${s.active === false ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"}`}>
                        {s.active === false ? "inactiv" : "activ"}
                      </button>
                    </div>
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Telefon WhatsApp</label>
                    <input value={s.phone} onChange={(e) => setDSuppliers((ss) => ss.map((x) => x.id === s.id ? { ...x, phone: e.target.value } : x))}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-mono mb-2" />
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Note (zile comanda/livrare)</label>
                    <input value={s.days} onChange={(e) => setDSuppliers((ss) => ss.map((x) => x.id === s.id ? { ...x, days: e.target.value } : x))}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm mb-2" />
                    <label className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Mesaj per locatie (antet comanda)</label>
                    {dActiveLocations.map((l) => (
                      <div key={l.id} className="flex items-center gap-2 mt-1.5">
                        <Badge loc={l.id} />
                        <input value={(s.templates && s.templates[l.id]) || ""}
                          onChange={(e) => setDSuppliers((ss) => ss.map((x) => x.id === s.id ? { ...x, templates: { ...x.templates, [l.id]: e.target.value } } : x))}
                          className="flex-1 px-2 py-1.5 rounded-lg border border-stone-300 text-xs min-w-0" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* BUTON TRIMITE NECESAR */}
      {tab === "necesar" && cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-30" style={{ background: "linear-gradient(transparent, #EFF1EC 30%)" }}>
          <button onClick={submitCart} className="w-full py-3.5 rounded-xl text-white font-bold shadow-lg" style={{ background: "#22402F" }}>
            {me.direct ? `Adauga la comenzi (${cartCount} produse)` : `Trimite spre aprobare (${cartCount} produse)`}
          </button>
        </div>
      )}

      {/* MODAL TRIMITERE WHATSAPP (v10 Etapa 4) */}
      {sendModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center p-3">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[88vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-stone-200">
              <div className="font-bold text-stone-900">Trimite catre {sendModal.supName}</div>
              <div className="text-xs text-stone-500">{locName(sendModal.loc)}{sendModal.queueRest && sendModal.queueRest.length > 0 ? ` - inca ${sendModal.queueRest.length} in coada` : ""}</div>
            </div>
            <div className="px-5 py-4">
              {sendModal.isGroup ? (
                <div>
                  <div className="text-sm text-stone-700 mb-2">Furnizor pe grup WhatsApp. Copiaza mesajul si trimite-l manual in grupul furnizorului, apoi confirma mai jos.</div>
                  <pre className="text-xs bg-stone-100 rounded-lg p-3 whitespace-pre-wrap break-words mb-3" style={{ fontFamily: "inherit" }}>{sendModal.msg}</pre>
                  <button onClick={() => copyMsg(sendModal.msg)} className="w-full py-2.5 rounded-lg bg-stone-900 text-white font-semibold text-sm">Copiaza mesajul</button>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-stone-700 mb-3">Comanda a fost deschisa in WhatsApp. Apasa <b>Send</b> in WhatsApp, apoi revino aici si confirma.</div>
                  <button onClick={() => window.open(sendModal.url, "_blank")} className="w-full py-2.5 rounded-lg text-white font-semibold text-sm mb-2" style={{ background: "#1FAF54" }}>Deschide WhatsApp</button>
                  <button onClick={() => copyMsg(sendModal.msg)} className="w-full py-2 rounded-lg bg-stone-100 text-stone-600 font-semibold text-xs">sau copiaza mesajul</button>
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-stone-200 flex gap-2">
              <button onClick={cancelSend} className="flex-1 py-2.5 rounded-lg bg-stone-200 text-stone-700 font-semibold text-sm">Inapoi fara confirmare</button>
              <button onClick={confirmSent} className="flex-1 py-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-sm">Confirma ca am trimis</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-20 left-4 right-4 z-40 bg-stone-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg text-center">
          {toast}
        </div>
      )}
    </div>
  );
}
