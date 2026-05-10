import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Calendar, 
  Utensils, 
  Bot, 
  User, 
  Home,
  ChevronRight,
  Plus,
  Clock,
  Flame,
  TrendingUp,
  Search,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { GymClass, Workout, GymUser } from './types';
import { getHealthAdvice } from './lib/gemini';

// Mock Data
const MOCK_USER: GymUser = {
  uid: '123',
  name: 'Nishant Raina',
  email: 'nishant@example.com',
  goal: 'muscle_gain',
  membershipTier: 'elite',
  stats: {
    weight: 75,
    height: 180,
    age: 28,
    dailyCaloriesGoal: 2800
  }
};

const MOCK_CLASSES: GymClass[] = [
  { id: '1', title: 'Power Yoga', type: 'Yoga', instructor: 'Sarah J.', startTime: '2026-05-10T14:30:00', duration: 60, capacity: 20, bookedCount: 15, intensity: 'Medium', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800' },
  { id: '2', title: 'Elite HIIT', type: 'HIIT', instructor: 'Mike R.', startTime: '2026-05-10T16:00:00', duration: 45, capacity: 15, bookedCount: 12, intensity: 'High', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800' },
  { id: '3', title: 'Boxing Pro', type: 'Boxing', instructor: 'Jessica L.', startTime: '2026-05-10T18:30:00', duration: 60, capacity: 10, bookedCount: 8, intensity: 'High', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800' },
];

const MOCK_WORKOUTS: Workout[] = [
  { id: 'w1', title: 'Morning Shred', duration: 30, calories: 350, difficulty: 'Intermediate', category: 'Home', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800', exercises: [] },
  { id: 'w2', title: 'Bulk & Build', duration: 60, calories: 500, difficulty: 'Advanced', category: 'Gym', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800', exercises: [] },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'classes' | 'workouts' | 'nutrition' | 'coach'>('home');
  const [user, setUser] = useState<GymUser>(MOCK_USER);

  return (
    <div className="h-screen bg-[#0A0A0A] text-white font-sans flex flex-col overflow-hidden">
      {/* Header Navigation - Editorial Style */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/10 bg-[#0A0A0A] z-50">
        <div className="text-2xl font-black tracking-tighter italic font-display">ZENFIT.EVO</div>
        
        <div className="hidden md:flex space-x-10 text-[10px] font-bold tracking-[0.2em] uppercase">
          <button onClick={() => setActiveTab('home')} className={cn("transition-colors hover:text-orange-500", activeTab === 'home' ? "text-orange-500 underline underline-offset-8" : "text-white/60")}>Dashboard</button>
          <button onClick={() => setActiveTab('classes')} className={cn("transition-colors hover:text-orange-500", activeTab === 'classes' ? "text-orange-500 underline underline-offset-8" : "text-white/60")}>Classes</button>
          <button onClick={() => setActiveTab('workouts')} className={cn("transition-colors hover:text-orange-500", activeTab === 'workouts' ? "text-orange-500 underline underline-offset-8" : "text-white/60")}>Workouts</button>
          <button onClick={() => setActiveTab('nutrition')} className={cn("transition-colors hover:text-orange-500", activeTab === 'nutrition' ? "text-orange-500 underline underline-offset-8" : "text-white/60")}>Nutrition</button>
          <button onClick={() => setActiveTab('coach')} className={cn("transition-colors hover:text-orange-500", activeTab === 'coach' ? "text-orange-500 underline underline-offset-8" : "text-white/60")}>AI Coach</button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-right">
            <div className="editorial-label">Elite Member</div>
            <div className="text-sm font-bold uppercase">{user.name}</div>
          </div>
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-bold border-2 border-white/20 shadow-xl shadow-orange-600/20 text-xs italic">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </nav>

      {/* Main Content Grid - 12 Columns */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 h-full overflow-y-auto"
          >
            {activeTab === 'home' && <DashboardView user={user} classes={MOCK_CLASSES} workouts={MOCK_WORKOUTS} />}
            {activeTab === 'classes' && <div className="p-12"><ClassesView classes={MOCK_CLASSES} /></div>}
            {activeTab === 'workouts' && <div className="p-12"><WorkoutsView workouts={MOCK_WORKOUTS} /></div>}
            {activeTab === 'nutrition' && <div className="p-12"><NutritionView user={user} /></div>}
            {activeTab === 'coach' && <div className="p-12"><AICoachView user={user} /></div>}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Bar Metrics */}
      <footer className="hidden lg:grid grid-cols-4 bg-white text-black border-t border-black/10">
        <BottomMetric label="Daily Energy" value="1,420" unit="KCAL" />
        <BottomMetric label="Sleep Score" value="92" unit="%" />
        <BottomMetric label="Heart Rate" value="68" unit="BPM" />
        <BottomMetric label="Zen Level" value="#14" unit="RANK" />
      </footer>

      {/* Mobile View Toggle (Simplified for this display) */}
      <nav className="md:hidden flex justify-around p-4 bg-[#111] border-t border-white/10">
         <Home onClick={() => setActiveTab('home')} className={cn("w-5 h-5", activeTab === 'home' ? "text-orange-500" : "text-white/40")} />
         <Calendar onClick={() => setActiveTab('classes')} className={cn("w-5 h-5", activeTab === 'classes' ? "text-orange-500" : "text-white/40")} />
         <Dumbbell onClick={() => setActiveTab('workouts')} className={cn("w-5 h-5", activeTab === 'workouts' ? "text-orange-500" : "text-white/40")} />
         <Bot onClick={() => setActiveTab('coach')} className={cn("w-5 h-5", activeTab === 'coach' ? "text-orange-500" : "text-white/40")} />
      </nav>
    </div>
  );
}

function BottomMetric({ label, value, unit }: { label: string, value: string, unit: string }) {
  return (
    <div className="border-r border-black/10 py-4 px-12 flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-tighter leading-tight">{label.split(' ')[0]}<br/>{label.split(' ')[1]}</span>
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-black italic font-display leading-none">{value}</span>
        <span className="text-[10px] font-bold opacity-40">{unit}</span>
      </div>
    </div>
  )
}

// Updated View Components with Editorial Style
function DashboardView({ user, classes, workouts }: { user: GymUser, classes: GymClass[], workouts: Workout[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-full divide-x divide-white/10">
      {/* Editorial Quote/Sidebar */}
      <div className="col-span-5 p-12 flex flex-col justify-between space-y-12">
        <motion.div
           initial={{ x: -50, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
        >
          <h1 className="text-7xl lg:text-9xl font-black leading-[0.82] tracking-tighter mb-8 uppercase italic font-display">
            Beyond<br/><span className="text-orange-500">Limits</span>
          </h1>
          <p className="text-lg text-white/40 font-serif italic max-w-md leading-relaxed pr-8">
            "Your body is a multi-dimensional ecosystem. We don't just track reps; we optimize the biological foundation of your existence."
          </p>
        </motion.div>

        <div className="space-y-6">
          <BenefitCard num="01" label="OPTIMIZED" title="Neuro-Clarity" desc="Enhance cognitive focus through cortisol-balancing HIIT protocols." />
          <BenefitCard num="02" label="ACTIVE" title="Metabolic Reset" desc="Precision nutrition and fasting cycles integrated with your load." />
        </div>
      </div>

      {/* Active Management / Quick Access */}
      <div className="col-span-1 md:col-span-7 bg-[#111] p-12 flex flex-col space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end space-y-4 md:space-y-0">
          <div>
            <div className="editorial-label text-orange-500 underline underline-offset-4 mb-3 italic">Next Session</div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter font-display leading-none">{classes[0].title}</h2>
            <p className="text-white/40 mt-2">Instructed by <span className="text-white font-bold italic">{classes[0].instructor}</span> &bull; 02:30 PM Today</p>
          </div>
          <button className="bg-white text-black px-8 py-4 font-black uppercase text-xs hover:bg-orange-500 transition-colors tracking-widest">Book Session</button>
        </div>

        {/* High Contrast Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div className="border-t-2 border-white/10 pt-8 group">
            <div className="editorial-label mb-4 opacity-40 group-hover:opacity-100 transition-opacity">Energy Expenditure</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-7xl font-black font-display leading-none">1,420</span>
              <span className="text-xl font-bold italic text-orange-500 uppercase font-display">Kcal</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 mt-6 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.5 }} className="h-full bg-orange-500" />
            </div>
            <div className="flex justify-between mt-3 editorial-label">
              <span>Weekly Target</span>
              <span>12,000 Total</span>
            </div>
          </div>

          <div className="border-t-2 border-white/10 pt-8 group">
            <div className="editorial-label mb-4 opacity-40 group-hover:opacity-100 transition-opacity">Muscle Recovery</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-7xl font-black font-display leading-none">82</span>
              <span className="text-xl font-bold italic text-orange-500 uppercase font-display">%</span>
            </div>
            <div className="flex mt-6 space-x-1 items-end h-4">
              {[8, 12, 10, 14, 6, 4, 9, 11, 15, 7].map((h, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: `${h * 1.5}px` }}
                  transition={{ delay: i * 0.05 }}
                  className={cn("w-2 bg-orange-500", i > 5 && "opacity-20")} 
                />
              ))}
            </div>
            <div className="mt-3 editorial-label">Biomechanical Load Analysis</div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-orange-600 text-black p-10 relative overflow-hidden group cursor-pointer hover:bg-orange-500 transition-colors">
          <div className="relative z-10">
            <h4 className="text-4xl font-black uppercase italic leading-none mb-3 font-display">Specialized<br/>Recovery Protocol</h4>
            <p className="text-sm font-medium mb-6 opacity-80 max-w-sm">Active muscle regeneration session based on your current biomechanical load.</p>
            <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-5 py-2 inline-block">Begin Guide</span>
          </div>
          <div className="absolute -right-16 -bottom-16 text-[220px] font-black italic opacity-10 uppercase leading-none pointer-events-none select-none font-display">REST</div>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ num, label, title, desc }: { num: string, label: string, title: string, desc: string }) {
  return (
    <div className="p-8 border border-white/10 hover:border-orange-500 transition-all cursor-pointer bg-white/[0.02] group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-black tracking-widest text-orange-500">BENEFIT {num}</span>
        <span className="text-[10px] px-2 py-1 bg-white/5 font-bold uppercase tracking-widest text-white/40">{label}</span>
      </div>
      <h3 className="text-3xl font-black uppercase italic font-display group-hover:text-orange-500 transition-colors">{title}</h3>
      <p className="text-sm text-white/30 mt-2 font-serif italic leading-relaxed">{desc}</p>
    </div>
  )
}

function StatCard({ icon, label, value, unit, subtext }: { icon: React.ReactNode, label: string, value: string, unit: string, subtext: string }) {
  return (
    <div className="bg-[#121212] p-6 rounded-3xl border border-[#1F1F1F] space-y-4 hover:border-orange-500/30 transition-all group">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-[#1A1A1A] rounded-2xl group-hover:bg-[#252525] transition-colors">{icon}</div>
        <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-widest leading-none">Healthy</span>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-gray-500 text-sm">{unit}</span>
        </div>
        <p className="text-gray-600 text-xs mt-2">{subtext}</p>
      </div>
    </div>
  );
}

function ClassesView({ classes }: { classes: GymClass[] }) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
        {classes.map((cls, i) => (
          <div key={cls.id} className="bg-[#0A0A0A] group relative overflow-hidden flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
              <img src={cls.image} alt={cls.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
            </div>
            <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">0{i + 1} // {cls.type}</span>
                  <span className="text-[10px] font-bold opacity-30 italic">{cls.intensity} Intensity</span>
                </div>
                <h3 className="text-4xl font-black italic font-display leading-none mb-4 group-hover:text-orange-500 transition-colors">{cls.title}</h3>
                <p className="text-white/40 text-sm font-serif italic mb-6">With {cls.instructor} &bull; Tomorrow, 10:30 AM &bull; {cls.duration} min</p>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="editorial-label">
                  <span className="text-white opacity-100 font-bold">{cls.capacity - cls.bookedCount}</span> Seats Left
                </div>
                <button className="text-xs font-black uppercase tracking-widest border-b-2 border-white hover:border-orange-500 hover:text-orange-500 transition-all pb-1">
                  Secure Spot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkoutsView({ workouts }: { workouts: Workout[] }) {
   return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex space-x-12 border-b border-white/10 pb-6 overflow-x-auto scrollbar-hide">
         {['Full Body', 'Lower', 'Upper', 'Abs', 'Cardio'].map((f, i) => (
           <button key={f} className="editorial-label hover:text-orange-500 transition-colors whitespace-nowrap">
             <span className="opacity-30 mr-2">0{i+1}</span> {f}
           </button>
         ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {workouts.map(w => (
          <div key={w.id} className="group cursor-pointer">
            <div className="relative aspect-[16/9] overflow-hidden border border-white/10 mb-6">
              <img src={w.image} alt={w.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-6 left-6">
                 <span className="bg-white text-black text-[10px] font-black px-4 py-2 uppercase tracking-widest">{w.difficulty}</span>
              </div>
            </div>
            <div className="flex justify-between items-end">
               <div>
                  <h3 className="text-5xl font-black italic font-display leading-none mb-3 group-hover:text-orange-500 transition-colors">{w.title}</h3>
                  <div className="flex items-center space-x-6 editorial-label">
                     <span>{w.duration} MINS</span>
                     <span className="w-1 h-1 bg-white/20 rounded-full" />
                     <span>{w.calories} KCAL</span>
                  </div>
               </div>
               <Plus className="w-10 h-10 text-white/20 group-hover:text-orange-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
   );
}

function NutritionView({ user }: { user: GymUser }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-8 space-y-16">
         <div>
            <div className="flex justify-between items-end mb-10 pb-6 border-b border-white/10">
               <h3 className="text-4xl font-black italic font-display">Fuel Log</h3>
               <button className="editorial-label text-orange-500 hover:underline underline-offset-4 flex items-center">
                  Add Nutrition <Plus className="w-3 h-3 ml-2" />
               </button>
            </div>
            <div className="divide-y divide-white/5">
               {[
                 { time: '08:00', name: 'Oatmeal & Protein Whey', cal: 450, macros: '45P / 60C / 10F', icon: '🥣' },
                 { time: '13:30', name: 'Grilled Salmon Bowl', cal: 620, macros: '55P / 40C / 20F', icon: '🥗' },
               ].map((meal, i) => (
                 <div key={i} className="py-8 flex items-center group cursor-pointer">
                    <span className="text-4xl mr-8 opacity-20 group-hover:opacity-100 transition-opacity">{meal.icon}</span>
                    <div className="flex-1">
                       <p className="text-xl font-black italic font-display group-hover:text-orange-500 transition-colors">{meal.name}</p>
                       <div className="flex items-center mt-1 editorial-label opacity-30">
                          <Clock className="w-3 h-3 mr-1" /> {meal.time}
                          <span className="mx-3 border-r border-white/20 h-3" />
                          {meal.macros}
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black italic font-display">{meal.cal}</p>
                       <p className="editorial-label">KCAL</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="p-12 border border-white/10 bg-white/[0.02]">
            <h3 className="editorial-label mb-8">System Hydration State</h3>
            <div className="flex justify-between items-end h-32 space-x-4">
               {[1,2,3,4,5,6,7,8].map(glass => (
                 <div key={glass} className="flex-1 flex flex-col items-center group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: glass <= 5 ? '80%' : '10%' }}
                      className={cn(
                        "w-full transition-all duration-700",
                        glass <= 5 ? "bg-orange-500" : "bg-white/5 group-hover:bg-white/10"
                      )} 
                    />
                    <span className="text-[9px] font-bold text-white/20 mt-4 uppercase tracking-[0.2em]">{glass}L</span>
                 </div>
               ))}
            </div>
            <p className="text-center text-sm italic font-serif text-white/40 mt-10">Optimized fluid levels maintained. Proceed with training.</p>
         </div>
      </div>

      <div className="lg:col-span-4 space-y-12">
         <div className="p-10 bg-[#111] border border-white/10">
            <div className="editorial-label text-center mb-8">Biological Breakdown</div>
            <div className="space-y-10">
               <MacroBar label="Protein" current={142} target={180} color="bg-orange-500" />
               <MacroBar label="Carbons" current={210} target={300} color="bg-white" />
               <MacroBar label="Lipids" current={60} target={80} color="bg-white/20" />
            </div>
         </div>
         
         <div className="bg-orange-600 p-10 text-black">
            <h4 className="font-black italic text-2xl uppercase font-display mb-4">Metabolic Tip</h4>
            <p className="text-sm font-medium leading-relaxed opacity-90">Insulin sensitivity is peak post-training. Prioritize high-glycemic carbohydrates now to catalyze recovery.</p>
         </div>
      </div>
    </div>
  );
}

function MacroBar({ label, current, target, color }: { label: string, current: number, target: number, color: string }) {
  const percent = (current / target) * 100;
  return (
    <div className="space-y-3">
       <div className="flex justify-between editorial-label opacity-100">
          <span className="opacity-40">{label}</span>
          <span className="italic font-display">{current} / {target}G</span>
       </div>
       <div className="h-1 w-full bg-white/5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn("h-full", color)} 
          />
       </div>
    </div>
  );
}

function AICoachView({ user }: { user: GymUser }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "HI NISHANT. I'M YOUR ZENFIT AI PROTOCOL. BIOMETRIC DATA SYNCHRONIZED. HOW SHALL WE OPTIMIZE TODAY?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg.toUpperCase() }]);
    setInput('');
    setIsTyping(true);

    try {
      const advice = await getHealthAdvice(user, userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: advice?.toUpperCase() || "PROTOCOL ERROR. RE-ATTEMPT." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "CONNECTION INTERRUPTED." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] border border-white/10 flex flex-col bg-[#0A0A0A] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="p-8 border-b border-white/10 flex items-center justify-between bg-[#111]">
        <div className="flex items-center space-x-6">
           <div className="w-12 h-12 bg-orange-600 flex items-center justify-center font-black italic">ZB</div>
           <div>
              <h3 className="text-xl font-black font-display italic leading-none">ZENBOT PROTOCOL</h3>
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.2em] mt-1">Status: Operational</p>
           </div>
        </div>
        <div className="editorial-label opacity-100 italic font-serif">Encrypted Link // AIS-92</div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex w-full",
            m.role === 'user' ? "justify-end" : "justify-start"
          )}>
            <div className={cn(
              "max-w-[70%] p-8 text-sm leading-[1.6]",
              m.role === 'user' 
                ? "bg-white text-black font-bold uppercase italic font-display" 
                : "bg-[#111] text-white/80 border border-white/10 font-serif italic"
            )}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="p-4 flex space-x-2">
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-orange-500" />
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-orange-500" />
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-orange-500" />
             </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-[#111] border-t border-white/10">
        <div className="relative flex">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="INPUT COMMAND OR QUERY..."
            className="flex-1 bg-transparent border-b border-white/20 pb-4 text-xs font-black tracking-widest uppercase focus:outline-none focus:border-orange-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            className="ml-4 editorial-label text-orange-500 font-black"
          >
            EXECUTE
          </button>
        </div>
      </div>
    </div>
  );
}
