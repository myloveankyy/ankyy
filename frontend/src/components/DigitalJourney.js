import React from 'react';
import { motion } from 'framer-motion';

const DigitalJourney = () => {
  return (
    <section className="relative w-full bg-white text-black">
      
      {/* === 00. HEADER: CLEAN & CRISP === */}
      <div className="pt-32 pb-20 px-6 md:px-12 border-b border-black">
        <div className="max-w-7xl mx-auto">
            {/* Top Tag */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-black"></div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest">
                    Archive: 2017—2023
                </span>
            </div>

            {/* Headline - FIXED: "Entrepreneur" is now very light/gray again */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-[8vw] md:text-[6vw] leading-[0.9] font-black uppercase tracking-tighter text-black mb-8">
                    The 14-Year-Old <br/>
                    <span className="text-gray-200">Entrepreneur.</span>
                </h2>
            </motion.div>
            
            {/* Intro Text */}
            <div className="flex flex-col md:flex-row gap-12 mt-12">
                <div className="md:w-1/3 border-l-4 border-black pl-6">
                    <p className="text-xl font-bold leading-tight">
                        Before the code was professional, the hustle was personal.
                    </p>
                </div>
                <div className="md:w-1/2">
                    <p className="text-lg text-gray-600 leading-relaxed">
                        This is the raw history of my digital life. No filters. No edited success stories. 
                        Just a kid trying to figure out the internet economy.
                    </p>
                </div>
            </div>
        </div>
      </div>


      {/* === 01. BIG INDIA === */}
      <EraSection 
        number="01"
        title="Big India"
        tag="The Jio Revolution"
        theme="light"
      >
        <div className="space-y-6 text-lg font-light leading-relaxed">
            <p>
                This was the golden <strong className="font-bold bg-yellow-300 px-1">“Paytm wallet side-income”</strong> era.
                People wanted apps that paid them for watching ads, and I delivered.
            </p>
            
            <StatDisplay value="$20,000" label="AdMob Revenue (5 Months)" />

            <p>
                A 14-year-old running one of the most downloaded earning apps in India.
                Sounds fancy right? Yeah… until the classic <span className="font-bold border-b-2 border-black">Ankyy problem</span> kicked in.
            </p>
        </div>

        <Villain 
            name="BOREDOM" 
            desc="I get bored of success too fast. Couldn’t stay focused. Popularity dropped. And boom—Big India became history."
        />
      </EraSection>


      {/* === 02. GRONEY === */}
      <EraSection 
        number="02"
        title="Groney"
        tag="The Second Hit"
        theme="dark"
      >
        <div className="space-y-6 text-lg font-light leading-relaxed text-gray-300">
            <p className="text-white">
                New design. Rewarded ads. Better psychology.
                <span className="block text-2xl font-bold mt-2 text-white">Same market. Bigger profits.</span>
            </p>
            
            <StatDisplay value="$12,000" label="Revenue (3 Months)" theme="dark" />

            <p>
                But guess what? My life’s recurring villain returned.
            </p>
        </div>

        <Villain 
            name="BANKING" 
            desc="Manual withdrawals + payment delays + age restrictions = App Shutdown. Running a money-circulation app as a teenager is a speedrun to pain."
            theme="dark"
        />
      </EraSection>


      {/* === 03. PUBG === */}
      <EraSection 
        number="03"
        title="PUBG Tourney"
        tag="14 Days of Fame"
        theme="light"
      >
        <div className="space-y-6 text-lg font-light leading-relaxed">
            <p>
                PUBG was on fire. Esports was booming.
                People were earning money by winning custom rooms. So I jumped in.
            </p>
            <p>
                Fully automated withdrawals. Merchant account (on my dad’s name).
                We were flying.
            </p>
            
            <StatDisplay value="₹11,000" label="Profit in 14 Days" />

            <p>
                And then…
            </p>
        </div>

        <Villain 
            name="GEOPOLITICS" 
            desc="PUBG got banned in India. Just like that—my 14-day startup became a 14-day obituary."
        />
      </EraSection>


      {/* === 04. THE BLOG === */}
      <EraSection 
        number="04"
        title="SEO Era"
        tag="The Underground"
        theme="gray"
      >
        <div className="space-y-6 text-lg font-light leading-relaxed">
            <p>
                I sold modded apps, premium tools—everything Google SEO would love or hate.
                I learned SEO deeply: <span className="font-mono bg-black text-white px-1">BlackHat</span>, WhiteHat, GreyHat.
            </p>
            
            <StatDisplay value="$1,200" label="Until the hammer dropped" />

            <p>
                Life punched me out of the internet for six months.
            </p>
        </div>

        <Villain 
            name="GOOGLE UPDATES" 
            desc="The algorithm ate my kingdom. Welcome to the internet."
        />
      </EraSection>


      {/* === 05. SKILLS GRID === */}
      <div className="bg-black text-white py-32 px-6 md:px-12 border-t border-gray-800">
         <div className="max-w-7xl mx-auto">
             <div className="flex items-end justify-between mb-24 border-b border-gray-800 pb-8">
                 <h3 className="text-[8vw] leading-none font-black uppercase tracking-tighter">
                     Beyond<br/>Code.
                 </h3>
                 <span className="hidden md:block font-mono text-sm tracking-widest text-gray-500">
                     // SYSTEM CAPABILITIES
                 </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-800 border border-gray-800">
                 <SkillBox 
                    title="IoT Solutions" 
                    desc="Custom hardware automation for hotels & shops. No degree. Just curiosity." 
                 />
                 <SkillBox 
                    title="Audio Engineering" 
                    desc="FL Studio. Cubase. Ableton. Unofficial music producer. (Yes, the rap tracks exist)." 
                 />
                 <SkillBox 
                    title="UI/UX Design" 
                    desc="Creativity is my default. I don't just build screens; I design feelings." 
                 />
             </div>

             <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs md:text-sm text-gray-400">
                 <StackList title="FRONTEND" items={['React', 'Next.js', 'Three.js', 'Framer', 'Vanilla JS']} />
                 <StackList title="MOBILE" items={['React Native', 'Expo', 'Kotlin', 'Java', 'Flutter']} />
                 <StackList title="BACKEND" items={['Node.js', 'Python', 'MongoDB', 'MySQL']} />
                 <StackList title="DEPLOY" items={['Docker', 'AWS', 'DigitalOcean', 'CI/CD']} />
             </div>
             
             <div className="mt-16 text-center md:text-left">
                 <p className="text-2xl md:text-3xl font-bold text-white">
                     "Basically, if it runs on a screen, I can make it."
                 </p>
             </div>
         </div>
      </div>


      {/* === 06. THE SOUL (Conclusion) === */}
      <div className="py-32 px-6 md:px-12 bg-white flex flex-col items-center text-center">
          
          <div className="max-w-4xl">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-6 block">
                  The Truth
              </span>
              
              <p className="text-2xl md:text-3xl leading-relaxed font-medium mb-12">
                  "Those numbers are nothing. Just the first 0.01% of my life."
              </p>

              <div className="w-px h-24 bg-black mx-auto mb-12"></div>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
                  The real story? I failed more than I succeeded. 
                  Lost money. Lost friends. <br/>
                  <strong className="text-black">Lost a pet—Happie—which hurt more than losing any project.</strong>
              </p>

              <p className="text-lg text-gray-600 leading-relaxed mb-16 max-w-2xl mx-auto">
                  I was unorganized, undisciplined, unaware... 
                  But I kept improving. Slowly. Silently. Consistently.
              </p>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-block border-2 border-black p-8 md:p-12 mb-16 bg-black text-white"
              >
                  <p className="text-2xl md:text-4xl font-black uppercase italic leading-tight">
                      "People say Sky is the limit.<br/>
                      I say, what if the sky is just the wallpaper?"
                  </p>
              </motion.div>

              <div className="flex flex-col gap-6 items-center">
                  <p className="font-bold text-xl tracking-tight">I'm still researching.</p>
                  
                  <p className="text-gray-500 font-serif italic text-lg max-w-lg">
                      "As for the failures... that’s the proprietary data I don't display on the frontend. 
                      But if you're building something impossible, we should probably compare notes."
                  </p>

                  <div className="mt-8">
                      <a href="mailto:hello@ankyy.com" className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-mono font-bold tracking-widest text-white uppercase transition-all duration-300 bg-black hover:bg-white hover:text-black border-2 border-black">
                          <span className="mr-2">Initiate Contact</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                  </div>
              </div>

          </div>
      </div>

    </section>
  );
};

// --- SUB-COMPONENTS ---

const EraSection = ({ number, title, tag, children, theme }) => {
    const isDark = theme === 'dark';
    const isGray = theme === 'gray';
    
    let bgClass = 'bg-white text-black border-black';
    if (isDark) bgClass = 'bg-black text-white border-white/20';
    if (isGray) bgClass = 'bg-gray-50 text-black border-black';

    return (
        <div className={`group relative py-24 px-6 md:px-12 border-t ${bgClass}`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 relative">
                    <div className="lg:sticky lg:top-32">
                        <span className="text-[6rem] md:text-[8rem] font-black leading-none opacity-10 select-none absolute -top-12 -left-4">
                            {number}
                        </span>
                        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter relative z-10">
                            {title}
                        </h3>
                        <div className={`mt-4 font-mono text-xs uppercase tracking-widest px-2 py-1 inline-block ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            {tag}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-7 lg:col-start-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const StatDisplay = ({ value, label, theme }) => (
    <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className={`my-12 pl-6 border-l-4 ${theme === 'dark' ? 'border-brand-teal' : 'border-black'}`}
    >
        <div className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-2">
            {value}
        </div>
        <div className="font-mono text-xs uppercase tracking-widest opacity-60">
            {label}
        </div>
    </motion.div>
);

const Villain = ({ name, desc, theme }) => {
    const isDark = theme === 'dark';
    return (
        <div className="mt-16 relative">
            <div className={`absolute top-0 left-0 w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
            <div className="pt-8">
                <span className={`font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-red-500' : 'text-red-600'}`}>
                    ⚠️ The Villain
                </span>
                <h4 className={`text-4xl md:text-5xl font-black uppercase mt-2 mb-4 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {name}
                </h4>
                <p className={`text-lg font-mono leading-relaxed opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {desc}
                </p>
            </div>
        </div>
    );
};

const SkillBox = ({ title, desc }) => (
    <div className="bg-black p-8 md:p-12 hover:bg-gray-900 transition-colors duration-300">
        <h4 className="text-xl font-bold uppercase mb-4 text-white">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

const StackList = ({ title, items }) => (
    <div>
        <h5 className="text-white mb-4">{title}</h5>
        <ul className="space-y-2">
            {items.map(item => (
                <li key={item}>— {item}</li>
            ))}
        </ul>
    </div>
);

export default DigitalJourney;