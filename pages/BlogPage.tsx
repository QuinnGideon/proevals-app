
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../constants/blogPosts';
import { BlogPost } from '../types';
import useScrollAnimate from '../hooks/useScrollAnimate';
import { ArrowLeft, BookOpen, Calendar, User as UserIcon, Tag } from 'lucide-react';
import NotFoundPage from './NotFoundPage';
import MetaTags from '../components/seo/MetaTags';

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    const cardRef = useScrollAnimate<HTMLDivElement>();
    return (
        <div ref={cardRef} className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)] p-8 flex flex-col scroll-reveal hover:border-[var(--color-brand-primary)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex-grow">
                <p className="text-sm text-[var(--color-text-secondary)]">{post.publicationDate}</p>
                <h3 className="mt-2 text-2xl font-bold text-[var(--color-text-primary)] leading-tight">{post.title}</h3>
                <p className="mt-4 text-[var(--color-text-secondary)]">{post.summary}</p>
            </div>
            <div className="mt-6">
                <Link to={`/blog/${post.id}`} className="font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-accent)]">
                    Read More &rarr;
                </Link>
            </div>
        </div>
    );
};

const BlogListPage: React.FC = () => {
    const sectionRef = useScrollAnimate<HTMLDivElement>();
    return (
        <div ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <BookOpen className="mx-auto h-16 w-16 text-[var(--color-brand-accent)]" />
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">ProEvals Blog</h1>
                    <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
                        Insights on product management, decision science, and professional growth.
                    </p>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {BLOG_POSTS.map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const BlogPostPage: React.FC<{ post: BlogPost }> = ({ post }) => {
    const sectionRef = useScrollAnimate<HTMLDivElement>();
    return (
        <>
            <MetaTags
                title={`${post.title} | ProEvals Blog`}
                description={post.summary}
                canonicalPath={`/blog/${post.id}`}
            />
            <div ref={sectionRef} className="py-20 sm:py-24 scroll-reveal">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="mb-8">
                        <Link to="/blog" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                            <ArrowLeft size={16} />
                            Back to all articles
                        </Link>
                    </div>
                    
                    <article>
                        <header>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">{post.title}</h1>
                            <div className="mt-6 flex items-center space-x-6 text-sm text-[var(--color-text-secondary)]">
                                <div className="flex items-center gap-2">
                                    <UserIcon size={14} />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>{post.publicationDate}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 text-xs font-medium bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] px-2 py-1 rounded-full">
                                       <Tag size={12}/> {tag}
                                    </span>
                                ))}
                            </div>
                        </header>
                        <div className="mt-8 pt-8 border-t border-[var(--color-border-primary)]">
                            {post.content}
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
};

const BlogPage: React.FC = () => {
    const { postId } = useParams<{ postId?: string }>();

    if (postId) {
        const post = BLOG_POSTS.find(p => p.id === postId);
        return post ? <BlogPostPage post={post} /> : <NotFoundPage />;
    }

    return <BlogListPage />;
};

export default BlogPage;