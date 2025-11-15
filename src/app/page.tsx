'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const languages = [
    { name: "Python", slug: "python", keywords: 35, icon: "🐍" },
    { name: "JavaScript", slug: "javascript", keywords: 52, icon: "⚡" },
    { name: "Java", slug: "java", keywords: 50, icon: "☕" },
    { name: "TypeScript", slug: "typescript", keywords: 72, icon: "💙" },
    { name: "C++", slug: "cpp", keywords: 92, icon: "⚙️" },
    { name: "Go", slug: "go", keywords: 25, icon: "🔷" },
    { name: "Rust", slug: "rust", keywords: 54, icon: "🦀" },
    { name: "C", slug: "c", keywords: 57, icon: "🔧" },
    { name: "Kotlin", slug: "kotlin", keywords: 75, icon: "🎯" },
  ];

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-hover">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Flashcards<span className="text-primary">.ai</span>
          </h1>
          <div className="flex gap-3 items-center">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-card-hover rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-background font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-card-hover rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-card-hover">
                      <p className="text-sm text-secondary">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-card-hover transition-colors text-red-500"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 text-sm font-medium text-secondary hover:text-foreground transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-6 py-2 bg-primary text-background rounded-lg font-medium hover:bg-primary-hover transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Master Programming Keywords
            <br />
            with{" "}
            <span className="text-primary">AI-Powered Flashcards</span>
          </h2>
          <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
            Learn 517 essential programming keywords across 9 languages. Track
            your progress, practice smart, and level up your coding knowledge.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  router.push('/languages');
                } else {
                  setShowRegisterModal(true);
                }
              }}
              className="px-8 py-4 bg-primary text-background rounded-lg font-semibold text-lg hover:bg-primary-hover transition-all hover:scale-105"
            >
              Start Learning Free
            </button>
            <button
              onClick={() => router.push('/languages')}
              className="px-8 py-4 bg-card text-foreground rounded-lg font-semibold text-lg hover:bg-card-hover transition-colors border border-card-hover"
            >
              View Languages
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-y border-card-hover">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">9</div>
              <div className="text-sm text-secondary mt-1">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">517</div>
              <div className="text-sm text-secondary mt-1">Flashcards</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">AI</div>
              <div className="text-sm text-secondary mt-1">Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">Free</div>
              <div className="text-sm text-secondary mt-1">Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Cards Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold">Choose Your Language</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-medium">
              All
            </button>
            <button className="px-4 py-2 bg-card text-secondary rounded-lg text-sm font-medium hover:bg-card-hover">
              Popular
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <div
              key={lang.slug}
              onClick={() => {
                if (isAuthenticated) {
                  router.push(`/languages/${lang.slug}`);
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="bg-card border border-card-hover rounded-xl p-6 hover:bg-card-hover transition-all cursor-pointer group hover:border-primary/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{lang.icon}</div>
                  <div>
                    <h4 className="text-xl font-semibold">{lang.name}</h4>
                    <p className="text-sm text-secondary">
                      {lang.keywords} keywords
                    </p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                  <span className="text-xs text-secondary">0%</span>
                </div>
                <button className="text-primary text-sm font-medium hover:text-primary-hover">
                  Start →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Master Programming
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-card-hover rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">AI-Generated Content</h4>
            <p className="text-secondary">
              Every flashcard is created by advanced AI with real code examples
              and detailed explanations.
            </p>
          </div>

          <div className="bg-card border border-card-hover rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">Smart Progress Tracking</h4>
            <p className="text-secondary">
              Track mastery levels from Beginner to Mastered with intelligent
              practice prioritization.
            </p>
          </div>

          <div className="bg-card border border-card-hover rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💻</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">Working Code Examples</h4>
            <p className="text-secondary">
              Each keyword includes practical, tested code examples you can run
              and learn from.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-hover mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center text-sm text-secondary">
            <div>© Flashcards.ai 2025</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                About
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                API Docs
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
