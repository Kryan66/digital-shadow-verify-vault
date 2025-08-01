# Digital Shadow - Blockchain Document Verification System

## Project Overview

Digital Shadow is a secure blockchain-based document verification platform that allows users to upload, verify, and manage documents with cryptographic proof of authenticity.

## Features

- **Secure Document Upload**: Upload documents with blockchain verification
- **Document Management**: Organize and track all your verified documents
- **Verification History**: Complete audit trail of all verification activities
- **User Authentication**: Secure login and registration system
- **Profile Management**: Manage your account settings and preferences

## Technology Stack

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **Backend**: Python (FastAPI/Flask)
- **Database**: PostgreSQL/SQLite
- **Blockchain**: Ethereum/IPFS for document verification

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd digital-shadow-verify-vault
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the development server**
   ```bash
   # Start frontend
   npm run dev
   
   # Start backend (in another terminal)
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080` to view the application.

## Development

### Frontend Development
- The frontend is built with React and TypeScript
- Uses Vite for fast development and building
- Styled with Tailwind CSS and shadcn-ui components

### Backend Development
- Python-based API server
- RESTful API endpoints for document management
- Blockchain integration for document verification

## Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
```bash
python app.py --production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
