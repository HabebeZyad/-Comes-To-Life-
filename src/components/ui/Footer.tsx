import { Eye, Instagram, Twitter, Facebook, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-background pt-24 pb-28 md:pb-12 border-t border-gold/20 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/5 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                    {/* Column 1: Brand & Social */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <span className="text-3xl animate-glow-pulse">𓂀</span>
                            <span className="font-display text-xl tracking-wider text-gold-gradient">
                                Comes to Life
                            </span>
                        </Link>
                        <p className="font-body text-muted-foreground leading-relaxed text-sm max-w-xs">
                            An interactive journey through digital humanities and ancient narratives, reimagining cultural heritage through modern technology and storytelling.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Knowledge */}
                    <div className="space-y-8">
                        <h4 className="font-display text-xs font-bold tracking-[0.3em] text-gold uppercase">Knowledge</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Storytelling', path: '/storytelling' },
                                { name: 'Historical Stories', path: '/stories' },
                                { name: 'Hieroglyphs', path: '/hieroglyphs' },
                                { name: 'Games', path: '/games' },
                                { name: 'Profile', path: '/profile' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="font-body text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2 group text-sm">
                                        <div className="w-1 h-1 rounded-full bg-gold scale-0 group-hover:scale-100 transition-transform" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Foundation */}
                    <div className="space-y-8">
                        <h4 className="font-display text-xs font-bold tracking-[0.3em] text-gold uppercase">Foundation</h4>
                        <ul className="space-y-4">
                            {['About Project', 'Contributors', 'Methodology', 'Education', 'Privacy Policy'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="font-body text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2 group text-sm">
                                        <div className="w-1 h-1 rounded-full bg-gold scale-0 group-hover:scale-100 transition-transform" />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="space-y-8">
                        <h4 className="font-display text-xs font-bold tracking-[0.3em] text-gold uppercase">Newsletter</h4>
                        <p className="font-body text-muted-foreground text-sm leading-relaxed">
                            Subscribe to receive updates on new chapters and historical insights.
                        </p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-muted/50 border border-gold/20 rounded-full px-6 py-3 text-sm font-body text-foreground focus:outline-none focus:border-gold/40 transition-all"
                            />
                            <button
                                aria-label="Subscribe to newsletter"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/30 transition-colors"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-display">
                        © {new Date().getFullYear()} COMES TO LIFE. ALL RIGHTS RESERVED.
                    </div>
                    <div className="flex gap-8 text-[9px] uppercase tracking-[0.2em] font-display text-muted-foreground">
                        <a href="#" className="hover:text-gold transition-colors">Documentation</a>
                        <a href="#" className="hover:text-gold transition-colors">Contact</a>
                        <a href="#" className="hover:text-gold transition-colors">Licensing</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
