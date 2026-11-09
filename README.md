# MONOLITH — არქიტექტურული ბეტონის ნაწარმი 🏗️

თანამედროვე, სწრაფი და დაცული ვებ-პლატფორმა არქიტექტურული და ლანდშაფტური ბეტონის ნაწარმის წარმოებისთვის (საფეხურები, რიგელები, ეზოს მოსაპირკეთებელი ფილები, საყვავილეები და სხვ.). სისტემა მოიცავს ონლაინ პარამეტრულ კალკულატორს, რეალურ დროში სინქრონიზებულ ადმინ-პანელსა და Firebase Cloud ინტეგრაციას.

---

## 🚀 ტექნოლოგიური სტეკი (Tech Stack)

- **Frontend Core:** [React 18](https://react.dev/), [Vite 5](https://vitejs.dev/) (ESBuild)
- **სტილები და დიზაინი:** [Tailwind CSS](https://tailwindcss.com/), Lucide Icons
- **ნავიგაცია:** [React Router v6](https://reactrouter.com/) (Route-level Code Splitting & Protected Routes)
- **მონაცემთა ბაზა & Auth:** [Google Cloud Firestore](https://firebase.google.com/docs/firestore), [Firebase Authentication](https://firebase.google.com/docs/auth)
- **ქეშირება და ოფლაინ შენახვა:** IndexedDB API (`getPersistentItem` / `setPersistentItem`) + LocalStorage Fallback
- **მონაცემთა ვალიდაცია:** [Zod](https://zod.dev/)
- **ავტომატური ტესტირება:** [Vitest](https://vitest.dev/) (100% Passing Unit Tests)

---

## ⚙️ სწრაფი გაშვების ინსტრუქცია (Quick Start)

### 1. რეპოზიტორის კლონირება და დამოკიდებულებების ინსტალაცია
```bash
git clone https://github.com/davitglonti/concrete-products.git
cd concrete-products
npm install
```

### 2. გარემოს ცვლადების კონფიგურაცია (.env)
დააკოპირეთ `.env.example` ფაილი `.env`-ად:
```bash
cp .env.example .env
```
შეავსეთ თქვენი Firebase პროექტის მონაცემები:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=concreteproducts-46cf3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=concreteproducts-46cf3
VITE_FIREBASE_STORAGE_BUCKET=concreteproducts-46cf3.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=112387655478
VITE_FIREBASE_APP_ID=1:112387655478:web:...
VITE_FIREBASE_MEASUREMENT_ID=G-...
```

### 3. აპლიკაციის გაშვება დეველოპმენტ რეჟიმში
```bash
npm run dev
```
აპლიკაცია გაეშვება ლოკალურ მისამართზე: `http://localhost:5173`

### 4. ავტომატური ტესტების გაშვება (Vitest)
```bash
npm test
```

### 5. პროდაქშენ ბილდი (Production Build)
```bash
npm run build
```

---

## 🔒 უსაფრთხოება და ავტორიზაცია (Security Architecture)

### 1. დაცული გარემოს ცვლადები
კოდიდან სრულად ამოღებულია სატესტო/პროდაქშენის ღია გასაღებები. Firebase ინიციალიზდება მხოლოდ `.env` ფაილში არსებული `import.meta.env.VITE_FIREBASE_*` ცვლადებით.

### 2. ProtectedRoute & Admin Guard
- ადმინ პანელის მთავარი მისამართი (`/admin`) დაცულია `<ProtectedRoute>` კომპონენტით.
- არაავტორიზებული მომხმარებელი ავტომატურად გადამისამართდება `/admin/login` გვერდზე.
- Firebase Auth ლისენერი მუშაობს გლობალურად მთელ აპლიკაციაში (`DataContext`), რაც უზრუნველყოფს ავტორიზაციის სტატუსის მყისიერ და საიმედო ამოცნობას.

### 3. Firestore Security Rules
პროექტის ძირში მოყვანილია `firestore.rules` ფაილი, რომელიც უნდა ჩაიტვირთოს Firebase Console -> Firestore Database -> Rules-ში:
- `products`, `categories`, `projects`, `site_settings`: საჯარო წაკითხვა (`allow read: if true`), ჩაწერა/განახლება **მხოლოდ ავტორიზებული ადმინისტრატორისთვის** (`allow write: if request.auth != null`).
- `inquiries`: ახალი მოთხოვნის გაგზავნა შეუძლია ნებისმიერ ვიზიტორს ვალიდური სახელითა და ნომრით, ხოლო მომხმარებელთა სიის წაკითხვა და წაშლა შეუძლია **მხოლოდ ადმინისტრატორს**.

---

## 🧮 კალკულატორის ალგორითმები (Mathematical Engines)

1. **საფეხურების კალკულატორი (`stepsCalc`):**
   - **გრძივი მეტრები:** `(რაოდენობა × სიგრძე) / 100`
   - **ზედაპირის ფართობი (მ²):** `რაოდენობა × (სიგრძე / 100) × (სიღრმე / 100)`
   - **სიღრმის კოეფიციენტი:** სტანდარტულ 35 სმ ბაზისზე დაყრდნობით (`stepDepth / 35`). სიღრმის ცვლილება (მაგ. 30 სმ, 40 სმ, 45 სმ) პროპორციულად ზრდის ბეტონის მოცულობას, წონასა და თვითღირებულებას.
   - **წებო-ცემენტი (C2TE):** `გრძივი მეტრი / 3.5` (დამრგვალებული ტომრებამდე).

2. **მოსაპირკეთებელი ფილების კალკულატორი (`paversCalc`):**
   - **ეფექტური ფართობი:** `სუფთა ფართობი × (1 + რეზერვი % / 100)`
   - **ფილების რაოდენობა:** `ეფექტური ფართობი / ფილის ფართობი (მ²)`
   - **უსაფრთხო Fallback:** თუ ფილის პარამეტრებში ზომა არასწორია ან 0-ია, კოდი იყენებს რეალისტურ საშუალო ზომას (0.05 მ²), რაც გამორიცხავს ფილების რაოდენობის 10-ჯერ შემცირებას.

---

## 📂 პროექტის სტრუქტურა

```
ConcreteProducts/
├── public/                     # სტატიკური რესურსები, favicon.svg
├── src/
│   ├── __tests__/              # Vitest ავტომატური Unit ტესტები
│   │   ├── calculator.test.js  # კალკულატორის მათემატიკური ტესტები
│   │   └── storage.test.js     # Zod სქემისა და შენახვის ტესტები
│   ├── components/             # React კომპონენტები
│   │   ├── admin/              # ადმინ მენეჯერები (SiteSettings, SEO, Calculator, Home)
│   │   ├── auth/               # ProtectedRoute კომპონენტი
│   │   ├── layout/             # Navbar, Footer, PublicLayout
│   │   └── ui/                 # მოდალები, ღილაკები, ბარათები
│   ├── config/
│   │   └── firebase.js         # უსაფრთხო Firebase ინიციალიზაცია
│   ├── context/
│   │   ├── DataContext.jsx     # ცენტრალური მდგომარეობის მართვა (useMemo, useCallback)
│   │   ├── ThemeContext.jsx    # მუქი/ღია თემის კონტექსტი
│   │   ├── FavoritesContext.jsx
│   │   └── CompareContext.jsx
│   ├── data/                   # საწყისი მონაცემები, ტექსტურები, პარამეტრები
│   ├── pages/                  # როუტების გვერდები (Home, Products, Calculator, Admin...)
│   │   └── admin/              # AdminDashboard, AdminLogin
│   ├── services/
│   │   └── firebaseService.js  # Firestore CRUD, Auth, Cloud სინქრონიზაცია
│   ├── utils/
│   │   ├── validation.js       # Zod სქემები და სუფთა გამოთვლის ფუნქციები
│   │   └── storage.js          # IndexedDB / localStorage პერსისტენტული შენახვა
│   ├── App.jsx                 # ძირითადი როუტერის კონფიგურაცია
│   └── main.jsx
├── .env.example                # გარემოს ცვლადების ნიმუში
├── firestore.rules             # Firestore-ის უსაფრთხოების წესები
├── package.json
├── tailwind.config.js
└── vite.config.js              # ოპტიმიზებული Manual Chunks (Firebase, Icons, React)
```

---

## 📄 ლიცენზია
პროექტი შექმნილია MONOLITH-ისთვის. ყველა უფლება დაცულია.
