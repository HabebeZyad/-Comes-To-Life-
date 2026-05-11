import { Eye, Instagram, Twitter, Facebook, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const knowledgeLinks = [
    { name: 'Storytelling', path: '/storytelling' },
    { name: 'Historical Stories', path: '/stories' },
    { name: 'Hieroglyphs', path: '/hieroglyphs' },
    { name: 'Games', path: '/games' },
    { name: 'Profile', path: '/profile' },
];

const foundationLinks = ['About Project', 'Contributors', 'Methodology', 'Education', 'Privacy Policy'];

export const Footer = () => {
    return (
        <footer className="relative overflow-hidden border-t border-gold/20 bg-background pb-28 pt-20 md:pb-12">
            <div className="absolute left-1/2 top-0 h-px w-full max-w-7xl -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="absolute inset-0 temple-grid opacity-25" />

            <div className="content-shell relative z-10">
                <div className="grid grid-cols-1 gap-12 rounded-lg border border-gold/10 bg-black/20 p-6 backdrop-blur-sm md:grid-cols-2 lg:grid-cols-4 lg:p-8">
                    <div className="space-y-7">
                        <Link to="/" className="group flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 transition-transform group-hover:scale-105">
                                <span className="text-xl text-gold-light drop-shadow-gold-glow">𓂀</span>
                            </span>
                            <span className="font-display text-xl text-gold-gradient">
                                Comes To Life
                            </span>
                        </Link>
                        <p className="max-w-xs font-body text-sm leading-relaxed text-muted-foreground">
                            A digital humanities experience that reimagines ancient Egyptian culture through storytelling, games, and interactive learning tools.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: Instagram, label: 'Instagram' },
                                { Icon: Twitter, label: 'Twitter' },
                                { Icon: Facebook, label: 'Facebook' },
                                { Icon: Mail, label: 'Email' },
                            ].map(({ Icon, label }) => (
                                <motion.a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    whileHover={{ y: -4, scale: 1.08 }}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20 text-muted-foreground transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
                                >
                                    <Icon className="h-4 w-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-display text-sm font-bold uppercase text-gold">Knowledge</h4>
                        <ul className="space-y-3">
                            {knowledgeLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="group flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
                                        <span className="h-1 w-1 rounded-full bg-gold opacity-0 transition-opacity group-hover:opacity-100" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-display text-sm font-bold uppercase text-gold">Foundation</h4>
                        <ul className="space-y-3">
                            {foundationLinks.map((link) => (
                                <li key={link}>
                                    <a href="#" className="group flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
                                        <span className="h-1 w-1 rounded-full bg-gold opacity-0 transition-opacity group-hover:opacity-100" />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-display text-sm font-bold uppercase text-gold">Newsletter</h4>
                        <p className="font-body text-sm leading-relaxed text-muted-foreground">
                            Receive chapter releases, restoration notes, and new learning-mode updates.
                        </p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full rounded-lg border border-gold/20 bg-muted/50 px-4 py-3 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-gold/50"
                            />
                            <button
                                aria-label="Subscribe to newsletter"
                                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-gold/30 bg-gold/15 text-gold transition-colors hover:bg-gold/25"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="temple-divider my-8" />

                <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
                    <div className="font-display text-xs uppercase text-muted-foreground">
                        © {new Date().getFullYear()} Comes To Life. All rights reserved.
                    </div>
                    <div className="flex flex-wrap justify-center gap-5 font-display text-xs uppercase text-muted-foreground">
                        <a href="#" className="transition-colors hover:text-gold">Documentation</a>
                        <a href="#" className="transition-colors hover:text-gold">Contact</a>
                        <a href="#" className="transition-colors hover:text-gold">Licensing</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
