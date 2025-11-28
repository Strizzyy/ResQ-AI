# ResQ-AI Frontend

A modern, responsive emergency response system frontend built with React and Tailwind CSS. This application enables citizens to report emergencies with multimodal data (images and text) and allows coordinators to view dynamically allocated volunteer tasks.

## 🚀 Features

- **Emergency Report Submission**: Submit incident reports with images and detailed descriptions
- **Multimodal Input**: Upload multiple images with drag-and-drop support
- **Task Management**: View and manage dynamically allocated volunteer tasks
- **Offline-First Architecture**: Queue reports when offline and sync when connection is restored
- **Real-time Status**: Online/offline status indicators
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Modern UI**: Beautiful gradient backgrounds, smooth animations, and glassmorphism effects

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router 6** - Client-side routing
- **Axios** - HTTP client with retry logic
- **LocalForage** - Offline storage (IndexedDB)
- **Lucide React** - Modern icon library
- **Framer Motion** - Animation library
- **Vite** - Build tool and dev server

## 📋 Prerequisites

- Node.js 16+ and npm
- Modern web browser

## 🔧 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ResQ-AI_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ConfirmationModal.jsx
│   ├── ImageUploader.jsx
│   └── TaskItem.jsx
├── context/            # React Context providers
│   └── AppContext.jsx
├── pages/              # Page components
│   ├── ReportSubmissionPage.jsx
│   └── TaskListPage.jsx
├── services/           # API and offline services
│   ├── apiService.js
│   └── offlineService.js
├── styles/             # Global styles and variables
│   ├── animations.css
│   └── variables.css
├── utils/              # Utility functions
│   ├── imageUtils.js
│   └── validators.js
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles with Tailwind
```

## 🎨 Key Features

### Report Submission
- Drag-and-drop image upload
- Base64 image encoding
- Form validation
- Offline queue support
- Success/error confirmation modals

### Task List
- Priority-based color coding (Critical, High, Medium, Low)
- Expandable task cards
- Volunteer progress tracking
- Location details with coordinates
- Skill requirement tags
- Time window display

### Offline Support
- Automatic offline detection
- Report queuing when offline
- Task caching
- Automatic sync when connection restored

## 🔌 Backend Integration

The frontend includes placeholder API endpoints that need to be replaced with actual backend URLs:

**API Endpoints:**
- `POST /api/reports` - Submit emergency report (LLM processing)
- `GET /api/tasks` - Fetch volunteer tasks (Genetic Algorithm output)

Update the `VITE_API_BASE_URL` in your `.env` file to point to your backend server.

## 🎯 Routes

- `/` - Report Submission Page (Landing page)
- `/tasks` - Task List Page (Volunteer task management)

## 🧪 Testing

Run linting:
```bash
npm run lint
```

## 📦 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the 'dist' folder
```

### AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

## 🤝 Contributing

This is a research project MVP. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is part of a research paper on Dynamic Task Allocation for emergency response systems.

## 👥 Team

Developed as part of the ResQ-AI research project for emergency response optimization using:
- Group Relative Policy Optimization (GRPO) based LLM
- Dynamic Genetic Algorithm (DGA) for task allocation
- Offline-First architecture for DIL environments

## 🐛 Known Issues

- Video upload is currently a placeholder (backend implementation pending)
- Mock data is used for task list until backend is connected

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This is an MVP (Minimum Viable Product) for research purposes. The backend components (LLM and Genetic Algorithm) are being developed separately.
