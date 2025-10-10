"use client";

import { useLanguage } from '@/app/components/contexts/language-context';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { aboutContent } from '@/lib/data';


// --- Animation Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, duration: 0.5 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};


//type ChallengePoint = { icon: React.ComponentType<any>; title: string; description: string; image: string; };
//type SolutionFeature = { icon: React.ComponentType<any>; title: string; description: string; image: string; };
//type StatItem = { icon: React.ComponentType<any>; value: string; label: string; };

// --- Reusable Banner Component ---
type InfoBannerProps = {
  imageSrc: string;
  imageAlt: string;
  imageOrder?: 'left' | 'right';
  children: ReactNode;
}

const InfoBanner = ({ imageSrc, imageAlt, imageOrder = 'left', children }: InfoBannerProps) => {
  const imageOrderClass = imageOrder === 'left' ? 'lg:order-1' : 'lg:order-2';
  const captionOrderClass = imageOrder === 'left' ? 'lg:order-2' : 'lg:order-1';

  return (
    <div className="w-full lg:grid lg:grid-cols-10 lg:gap-12 lg:items-center">
      <div className={`lg:col-span-6 ${imageOrderClass}`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full object-cover rounded-lg shadow-lg aspect-[4/3] md:aspect-video lg:aspect-[6/4]"
          loading="lazy"
        />
      </div>
      <div className={`lg:col-span-4 py-8 lg:py-0 ${captionOrderClass}`}>
        {children}
      </div>
    </div>
  );
};

const About = () => {
  const { language } = useLanguage();
  const t = aboutContent[language];

  return (
    <main className="bg-white dark:bg-slate-900 font-sans text-primary dark:text-white ">
      <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">

        <motion.section 
          className="text-center mb-20 md:mb-28 max-w-4xl mx-auto"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            {t.hero.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto opacity-90">
            {t.hero.subtitle}
          </motion.p>
          <motion.div variants={itemVariants} className="mt-10 bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
             <h2 className="text-2xl font-bold tracking-tight">{t.hero.missionTitle}</h2>
             <p className="mt-2 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed">
              {t.hero.mission}
             </p>
          </motion.div>
        </motion.section>

        {/* --- CHALLENGE SECTION --- */}
        <section className="mb-24 md:mb-32">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              {t.challenge.title}
            </h2>
            <p className="text-base md:text-lg opacity-90">
              {t.challenge.intro}
            </p>
          </motion.div>
          <div className="space-y-16 md:space-y-24">
            {t.challenge.points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <InfoBanner
                  imageSrc={point.image}
                  imageAlt={point.title}
                  imageOrder={index % 2 === 0 ? 'left' : 'right'}
                >
                  <div className="flex items-start gap-4">
                    <point.icon className="h-8 w-8 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-semibold leading-snug">{point.title}</h3>
                      <p className="mt-2 text-base sm:text-lg leading-relaxed opacity-90">{point.description}</p>
                    </div>
                  </div>
                </InfoBanner>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- SOLUTION SECTION --- */}
        <section className="mb-24 md:mb-32">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">
              {t.solution.title}
            </h2>
            <p className="text-base md:text-lg opacity-90">
              {t.solution.intro}
            </p>
          </motion.div>
          <div className="space-y-16 md:space-y-24">
            {t.solution.features.map((feature, index) => (
               <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <InfoBanner
                  imageSrc={feature.image}
                  imageAlt={feature.title}
                  imageOrder={index % 2 === 0 ? 'left' : 'right'}
                >
                  <div className="flex items-start gap-4">
                    <feature.icon className="h-8 w-8 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-semibold leading-snug">{feature.title}</h3>
                      <p className="mt-2 text-base sm:text-lg leading-relaxed opacity-90">{feature.description}</p>
                    </div>
                  </div>
                </InfoBanner>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <motion.section 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            {t.cta.title}
          </motion.h2>
          <motion.div variants={itemVariants} className="flex justify-center gap-8 sm:gap-12 mb-10 flex-wrap">
            {t.cta.stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <stat.icon className="h-10 w-10 mb-2" />
                <span className="font-extrabold text-3xl sm:text-4xl leading-tight">{stat.value}</span>
                <span className="text-base sm:text-lg opacity-80">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button asChild className="px-10 py-4 text-lg sm:text-xl font-semibold" variant="default">
              <Link href="/catalog">{t.cta.primaryActionText}</Link>
            </Button>
          </motion.div>

          <motion.p variants={itemVariants} className="mt-4 text-sm sm:text-base opacity-80">
            {t.cta.helpText}{' '}
            <Link href="/help" className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-white dark:ring-offset-slate-900 rounded-sm">
              {t.cta.helpLinkText}
            </Link>
          </motion.p>
        </motion.section>
      </div>
    </main>
  );
};

export default About;