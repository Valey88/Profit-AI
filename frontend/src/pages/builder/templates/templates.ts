import { v4 as uuidv4 } from 'uuid';

import { Block } from '../store/builderStore';

interface Template {
    id: string;
    name: string;
    description: string;
    blocks: Block[];
}

export const templates: Template[] = [
    {
        id: 'business-classic',
        name: 'Classic Business',
        description: 'Professional layout for corporate sites.',
        blocks: [
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/1200x400', alt: 'Hero Banner', width: '100%' } },
            { id: uuidv4(), type: 'text', content: { text: 'Welcome to Our Company', tag: 'h1', align: 'center' } },
            { id: uuidv4(), type: 'text', content: { text: 'We provide the best solutions for your business growth.', tag: 'p', align: 'center' } },
            { id: uuidv4(), type: 'faq', content: { items: [{ question: 'What do you do?', answer: 'We help businesses grow.' }] } },
        ]
    },
    {
        id: 'portfolio-minimal',
        name: 'Minimal Portfolio',
        description: 'Clean design for creatives.',
        blocks: [
            { id: uuidv4(), type: 'text', content: { text: 'My Portfolio', tag: 'h1', align: 'left' } },
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/800x600', alt: 'Project 1', width: '100%' } },
            { id: uuidv4(), type: 'text', content: { text: 'Project Description', tag: 'p', align: 'left' } },
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/800x600', alt: 'Project 2', width: '100%' } },
        ]
    },
    {
        id: 'tech-startup',
        name: 'Tech Startup',
        description: 'Modern and sleek for SaaS.',
        blocks: [
            { id: uuidv4(), type: 'text', content: { text: 'The Future of Tech', tag: 'h1', align: 'center' } },
            { id: uuidv4(), type: 'slider', content: { slides: [{ src: 'https://via.placeholder.com/1200x500', caption: 'Feature 1' }, { src: 'https://via.placeholder.com/1200x500', caption: 'Feature 2' }] } },
            { id: uuidv4(), type: 'text', content: { text: 'Join 10,000+ users today.', tag: 'h3', align: 'center' } },
        ]
    },
    {
        id: 'restaurant-delight',
        name: 'Restaurant Delight',
        description: 'Appetizing layout for food businesses.',
        blocks: [
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/1200x600', alt: 'Delicious Food', width: '100%' } },
            { id: uuidv4(), type: 'text', content: { text: 'Our Menu', tag: 'h2', align: 'center' } },
            { id: uuidv4(), type: 'text', content: { text: 'Taste the difference.', tag: 'p', align: 'center' } },
        ]
    },
    {
        id: 'fitness-pro',
        name: 'Fitness Pro',
        description: 'Energetic design for gyms and coaches.',
        blocks: [
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/1200x500', alt: 'Gym Workout', width: '100%' } },
            { id: uuidv4(), type: 'text', content: { text: 'Get in Shape Now', tag: 'h1', align: 'center' } },
            { id: uuidv4(), type: 'faq', content: { items: [{ question: 'Membership cost?', answer: '$50/month' }] } },
        ]
    },
    // Adding more templates to reach 15...
    {
        id: 'law-firm',
        name: 'Law Firm',
        description: 'Trustworthy and serious.',
        blocks: [
            { id: uuidv4(), type: 'text', content: { text: 'Legal Experts', tag: 'h1', align: 'left' } },
            { id: uuidv4(), type: 'text', content: { text: 'Defending your rights.', tag: 'p', align: 'left' } },
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/1200x400', alt: 'Office', width: '100%' } },
        ]
    },
    {
        id: 'medical-center',
        name: 'Medical Center',
        description: 'Clean and reassuring.',
        blocks: [
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/1200x400', alt: 'Doctors', width: '100%' } },
            { id: uuidv4(), type: 'text', content: { text: 'Caring for your health', tag: 'h1', align: 'center' } },
            { id: uuidv4(), type: 'text', content: { text: 'Book an appointment today.', tag: 'p', align: 'center' } },
        ]
    },
    {
        id: 'marketing-agency',
        name: 'Marketing Agency',
        description: 'Bold and creative.',
        blocks: [
            { id: uuidv4(), type: 'text', content: { text: 'We Grow Brands', tag: 'h1', align: 'center' } },
            { id: uuidv4(), type: 'slider', content: { slides: [{ src: 'https://via.placeholder.com/800x400', caption: 'Campaign 1' }] } },
        ]
    },
    {
        id: 'education-school',
        name: 'Education & School',
        description: 'Informative and welcoming.',
        blocks: [
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/1200x400', alt: 'School', width: '100%' } },
            { id: uuidv4(), type: 'text', content: { text: 'Learn with us', tag: 'h1', align: 'center' } },
        ]
    },
    {
        id: 'event-conference',
        name: 'Event & Conference',
        description: 'Schedule focused layout.',
        blocks: [
            { id: uuidv4(), type: 'text', content: { text: 'Annual Tech Conference', tag: 'h1', align: 'center' } },
            { id: uuidv4(), type: 'text', content: { text: 'September 2026', tag: 'h3', align: 'center' } },
            { id: uuidv4(), type: 'faq', content: { items: [{ question: 'Agenda?', answer: 'TBA' }] } },
        ]
    },
    {
        id: 'real-estate',
        name: 'Real Estate',
        description: 'Showcase properties.',
        blocks: [
            { id: uuidv4(), type: 'slider', content: { slides: [{ src: 'https://via.placeholder.com/1200x600', caption: 'Luxury Home' }] } },
            { id: uuidv4(), type: 'text', content: { text: 'Find Your Dream Home', tag: 'h1', align: 'center' } },
        ]
    },
    {
        id: 'consulting',
        name: 'Business Consulting',
        description: 'Strategy and analysis.',
        blocks: [
            { id: uuidv4(), type: 'text', content: { text: 'Expert Consulting', tag: 'h1', align: 'right' } },
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/1200x400', alt: 'Meeting', width: '100%' } },
        ]
    },
    {
        id: 'ecommerce-shop',
        name: 'E-Commerce Shop',
        description: 'Product focused.',
        blocks: [
            { id: uuidv4(), type: 'text', content: { text: 'New Arrivals', tag: 'h1', align: 'center' } },
            { id: uuidv4(), type: 'slider', content: { slides: [{ src: 'https://via.placeholder.com/400x400', caption: 'Product 1' }, { src: 'https://via.placeholder.com/400x400', caption: 'Product 2' }] } },
        ]
    },
    {
        id: 'photography',
        name: 'Photography Studio',
        description: 'Visual heavy.',
        blocks: [
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/1200x800', alt: 'Photo 1', width: '100%' } },
        ]
    },
    {
        id: 'blog-personal',
        name: 'Personal Blog',
        description: 'Text focused.',
        blocks: [
            { id: uuidv4(), type: 'image', content: { src: 'https://via.placeholder.com/200x200', alt: 'Author', width: '200px' } },
            { id: uuidv4(), type: 'text', content: { text: 'My Thoughts', tag: 'h1', align: 'center' } },
            { id: uuidv4(), type: 'text', content: { text: 'Post 1...', tag: 'p', align: 'left' } },
        ]
    }
];
