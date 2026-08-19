import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LineChart, ShieldCheck, ArrowRight, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-hidden">
      
      {/* Navbar Section */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-emerald-600 to-teal-400 p-2 rounded-xl shadow-lg shadow-emerald-200">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-teal-600">
                Hifz Tracker
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-stone-600 hover:text-emerald-700 font-medium transition-colors px-3 py-2">
                Log in
              </Link>
              <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse_8s_ease-in-out_infinite] animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-stone-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse_8s_ease-in-out_infinite] animation-delay-4000"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium text-sm mb-8">
            <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
            <span>The elegant way to track your Quran memorization</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-stone-900 mb-6 drop-shadow-sm">
            Master Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Hifz Journey</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A beautiful, intuitive tracker designed to help you stay consistent, visualize your progress, and reach your memorization goals with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/login" className="group relative w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-emerald-200 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden">
              <span className="relative z-10">Start Tracking Free</span>
              <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">Everything you need to succeed</h2>
            <p className="text-stone-500 max-w-xl mx-auto text-lg">Simple yet powerful tools designed specifically for Quran memorization students.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:bg-emerald-50 hover:border-emerald-100 transition-colors duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-400 group-hover:text-white transition-all duration-300">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Daily Logging</h3>
              <p className="text-stone-600 leading-relaxed">
                Log your Sabaq, Sabaqi, and Manzil daily with our intuitive interface. Keep track of exactly what you revised and memorized.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:bg-emerald-50 hover:border-emerald-100 transition-colors duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-teal-600 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-cyan-400 group-hover:text-white transition-all duration-300">
                <LineChart className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Visual Progress</h3>
              <p className="text-stone-600 leading-relaxed">
                Watch your progress grow with beautiful charts and distribution maps. See exactly which Surahs you are strong in.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:bg-emerald-50 hover:border-emerald-100 transition-colors duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-emerald-600 group-hover:to-teal-500 group-hover:text-white transition-all duration-300">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Secure & Private</h3>
              <p className="text-stone-600 leading-relaxed">
                Your data is securely stored in the cloud. Access your hifz history from anywhere, safely authenticated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-stone-900"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to elevate your memorization?</h2>
          <p className="text-stone-300 mb-10 text-lg">Join today and build the consistency needed to reach your goals.</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-stone-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            Create Your Account
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-stone-950 py-8 text-center text-stone-500 text-sm border-t border-stone-800">
        <p>&copy; {new Date().getFullYear()} Hifz Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
