# 📝 ExamForge — Question Bank & Paper Generator

An offline-first mobile application for building question banks and generating exam papers. Built with React Native, .NET, Supabase, and SQLite — syncs automatically when back online.

---

## 🚀 Features

- **Question Bank Management** — Create, organize, and manage questions by subject, topic, or difficulty
- **Exam Paper Generation** — Generate customized exam papers from your question bank
- **PDF Export** — Download generated papers as professionally formatted QuestPDF documents
- **Offline-First** — Full functionality without an internet connection using local SQLite storage
- **Auto Sync** — Automatically syncs local data with the ASP.NET Core backend when internet is restored
- **Cross-Platform** — Runs on both Android and iOS

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native |
| Backend API | .NET |
| Cloud Database | PostgreSQL |
| Local Storage | SQLite |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [.NET SDK](https://dotnet.microsoft.com/download) (v8+)
- PostgreSQL database access
- Android Studio / Xcode (for emulator/simulator)

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install frontend dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:5000
```

### 4. Set up the .NET backend

```bash
cd ExamForge.Api
dotnet restore
dotnet run
```

### 5. Run the mobile app

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

---

## 🗄️ Database Setup

### PostgreSQL

1. Create a PostgreSQL database
2. Apply the database migrations used by the ASP.NET Core backend
3. Set the backend connection string in `appsettings.Development.json`

### SQLite (Local)

SQLite is configured automatically on first app launch. No additional setup required.

---

## 📂 Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API & database services
│   ├── store/            # State management
│   └── utils/            # Helper functions
├── ExamForge.Api/        # .NET API project
├── database/
│   └── migrations/       # Supabase SQL migrations
└── README.md
```

---

## 🔄 Offline Sync

The app uses a **sync queue** strategy:

1. All changes made offline are saved to SQLite with local sync metadata such as `IsSynced`, `Version`, and `UpdatedAt`
2. When internet connectivity is detected, the sync service pushes queued changes to `POST /api/sync/upload`
3. Remote changes are pulled with `GET /api/sync/download?sinceToken=...` and merged into the local database
4. The backend uses version-based conflict detection and a server-side change log for incremental pulls

## 📄 PDF Export

The API exposes `POST /papers/pdf` to turn a generated paper model into a downloadable PDF file.
It uses QuestPDF with a structured header, grouped question sections, and page numbering.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

Have a question or suggestion? Open an issue or reach out via GitHub Discussions.
