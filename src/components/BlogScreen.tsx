import { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, ArrowLeft, Search, Bookmark, Share2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: 'Heritage' | 'Health & Nutrition' | 'Recipes' | 'Impact & Sustainability';
  date: string;
  author: string;
  readTime: string;
  image: string;
}

export default function BlogScreen() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const blogPosts: BlogPost[] = [
    {
      id: 'sacred-harvesting-euryale-ferox',
      title: "The Sacred Harvesting of Euryale Ferox: Mithila's Black Diamonds",
      category: 'Heritage',
      date: 'July 15, 2026',
      author: 'Dr. Ramakant Jha (Sourcing Director)',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=1000',
      excerpt: "Before it becomes the perfect crisp, white puff, Makhana begins its journey deep beneath the calm waters of North Bihar's pristine wetland ponds. Explore the intensive 2,000-year-old art of hand-harvesting.",
      content: [
        "The story of Makhana (Euryale ferox, commonly known as prickly water lily or fox nut) is as old as the hills of Mithila. Grown in stagnant, fresh water bodies, this aquatic crop represents a breathtaking agricultural marvel. The seeds must be gathered from the muddy pond floors—a delicate task requiring unparalleled breath control and precision.",
        "At the crack of dawn, our direct farm partners head out on traditional wooden rafts. Equipped with a bamboo pole (called 'Kaara') and wooden sieves, they plunge beneath the water to scoop up the sticky, spiky seed pods. The muddy beds of Bihar's water reservoirs hold these precious 'black diamonds' safely, and harvesting them is a labor of supreme dedication.",
        "Once harvested, the seed pods are washed, cleaned of their slimy outer membrane, and dried under the bright Bihari sun. The outer shell turns a dark brown, almost charcoal black. Inside lies the precious kernel that will later pop into the light, white superfood we all love.",
        "Traditionally, only a few specialized farming clans possess the ancient technique of popping the seeds. They roast them in five different iron woks on extreme, open wood fires, cracking them open with wooden mallets with rapid, rhythmic, musical strokes. This traditional wood-fire puffing is what gives Bihar Bite Makhana its natural, superior taste profile compared to mass-produced mechanical alternatives.",
        "Supporting this crop doesn't just mean a healthy lifestyle—it ensures the preservation of an irreplaceable aquatic ecosystem and the continuation of a 2,000-year-old cultural legacy of Mithila."
      ]
    },
    {
      id: 'why-makhana-is-ultimate-superfood',
      title: "Why Makhana is the Ultimate Modern Superfood",
      category: 'Health & Nutrition',
      date: 'June 28, 2026',
      author: 'Shalini Sen (Gourmet Nutritionist)',
      readTime: '4 min read',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE8NZSYfiYMC09NWAibdLNv51ejq_Qp1-IFFWffR4LcaiYNtj0A3_mCmJVgCb__MAvXOpTgarPpFjmIQpgJTjBptORCKIGkbJT4cDDgacGBmknR6wR0eRTBJ96olvbu-8lFwFRqLLWRWxjRLJXlf9LBvaW7avfUswRCpqzZx_O_wMbqAcfYXd9s9_DDpMApj1AMKne5x_XkoB3G9xA9e1hGovyZj0G8ZBQ5Ed4cULYicJxBjWcGX6Hpw',
      excerpt: "Loaded with plant-based protein, rich in fiber, and completely gluten-free. Discover why global health enthusiasts are swapping processed chips for traditional Bihar Fox Nuts.",
      content: [
        "In a world where processed snacks are laden with seed oils, chemical preservatives, and excessive sodium, health-conscious consumers are searching for clean, simple, and ancient alternatives. Enter Makhana.",
        "Per 100 grams, these organic popped lotus seeds offer a stellar nutritional profile: roughly 9.7 to 11.1 grams of high-quality plant-based protein, virtually zero saturated fats, and over 14 grams of dietary fiber that promotes superb digestive health.",
        "Makhana is incredibly rich in magnesium, an essential mineral that helps regulate heart rhythm, supports bone development, and improves deep sleep quality. They also have an ideal potassium-to-sodium ratio, making them a fantastic dietary choice for individuals looking to maintain healthy blood pressure levels.",
        "Unlike standard potato chips or corn puffs, makhana has a very low glycemic index (GI), meaning it releases energy slowly without causing sudden blood sugar spikes. This makes it an ideal snack for weight management, diabetic control, and late-night cravings.",
        "At Bihar Bite, we preserve these natural benefits by slow-roasting the seeds. Rather than deep-frying them in cheap palm oil, we use premium cold-pressed oils or fresh cow ghee to ensure you receive pure, wholesome nutrition with every handful."
      ]
    },
    {
      id: 'culinary-artistry-spice-roasting',
      title: "Culinary Artistry: Elevating Roasted Makhana with Natural Spices",
      category: 'Recipes',
      date: 'June 10, 2026',
      author: 'Chef Rohan Bhattacharya',
      readTime: '6 min read',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeFYgCxP5A0_pK4KhY5-yEMquxVfiXvJ1Qrp_kVb_nKFR-Y-AAPJYcuBC1e5YsDgLx9lXC0eiu7CylCOb3BdqEktK541jAnk4rwBd-CGzJIBxoEMGV2jyCGhMgKqZmToiHZYVqzEe2MGvzIZ8jglsVo9GQEw5DLUMdn7gB7wuOqdZGAQY3gkKg4CIA2-2qJ8I5ORNEB83AfDF3N1eOfKNxIO1mILrYWIRgqfSJsZ7NioB0J78v-xEswg',
      excerpt: "From slow-roasting in pure A2 cow ghee to infusing with Himalayan Pink Salt, Aged Cheddar, or Smoked Peri-Peri. Step inside our culinary kitchen.",
      content: [
        "Plain makhana has a clean, neutral, and wonderfully airy texture. It behaves like a blank culinary canvas, absorbing seasonings beautifully. Today, we invite you into the Bihar Bite kitchen to see how we blend traditional spices to create gourmet profiles.",
        "The secret to a perfectly flavored makhana is the binding agent. Without a healthy fat, dry spices simply fall to the bottom of the roasting pan. We use either pure cow ghee (A2) or organic cold-pressed oils. When lightly heated, these fats coat the outer surface of each kernel, allowing the spices to adhere flawlessly.",
        "For our Himalayan Pink Salt roasted makhana, we use fine-grain pink mineral salt harvested from natural mountain deposits. We slow-roast the fox nuts for exactly 12 minutes to ensure a crispy crunch without losing the delicate buttery undertones.",
        "Our Smoked Peri-Peri blend is a tribute to global tastes. We combine authentic ground African bird's eye chili, sweet paprika, dried garlic, and real lemon peel. The result is a bright, tangy heat that finishes with a gentle smoky note.",
        "If you are roasting makhana at home, remember this golden rule: always roast on low-to-medium heat. The delicate starches inside the seed puff can burn easily under high flame. Take your time, stir continuously, and let the natural warmth cook them into perfect crispness."
      ]
    },
    {
      id: 'empowering-mithilas-women',
      title: "Empowering Mithila's Women: The Human Story Behind Your Snack",
      category: 'Impact & Sustainability',
      date: 'May 24, 2026',
      author: 'Amrita Singh (Co-founder)',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000',
      excerpt: "Makhana production is a labor of love. Meet the resilient women of our self-help farm collectives who clean, sort, and grade each seed to perfection.",
      content: [
        "While the harvesting of lotus seeds from pond beds is predominantly done by male fishers, the entire processing, sorting, grading, and cleaning of puffed makhana is driven by the masterful women of Mithila.",
        "In rural Bihar, women have long been the keepers of agricultural heritage. Historically, however, their contributions went uncompensated. Bihar Bite was founded with a singular, resolute objective: to establish financial independence directly for these women.",
        "We support three cooperative self-help groups (SHGs) comprising over 75 women from marginalized farming communities. Armed with fair-wage models and safe working conditions, these women manually grade the popped kernels by size. Only the large, premium grade-A seeds (known as 'Phool' or flower makhana) make it into our signature boxes.",
        "With their earnings, these women are funding their children's education, investing in local healthcare, and gaining a powerful voice in village assemblies. Snacking responsibly shouldn't just feel good for your body; it should empower the communities that make it possible.",
        "Every time you open a bag of Bihar Bite, you are directly celebrating the resilience, hard work, and artistry of Mithila's women."
      ]
    }
  ];

  const categories = ['All', 'Heritage', 'Health & Nutrition', 'Recipes', 'Impact & Sustainability'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[0];

  return (
    <div id="hero" className="max-w-7xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-24 font-sans">
      {selectedPost ? (
        // Full Article Detail View
        <article className="max-w-3.5xl mx-auto animate-fade-in">
          {/* Back Button */}
          <button 
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#7C8464] transition-colors mb-8 uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </button>

          {/* Article Header */}
          <div className="space-y-4 mb-8">
            <span className="inline-block bg-[#7C8464]/10 text-[#7C8464] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {selectedPost.category}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-stone-900 leading-tight font-light">
              {selectedPost.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-2 border-b border-stone-200 pb-4">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {selectedPost.author}
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {selectedPost.date}
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-[32px] overflow-hidden shadow-md border border-stone-200 mb-10 aspect-[21/9] bg-stone-100">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-stone max-w-none space-y-6 text-stone-700 text-sm md:text-base leading-relaxed font-light">
            {selectedPost.content.map((paragraph, index) => {
              // Format some parts beautifully
              if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
                return (
                  <blockquote key={index} className="border-l-4 border-[#C5B592] pl-6 italic text-[#4A4A3A] font-serif text-lg py-3 my-8 bg-[#FAF8F4] rounded-r-2xl">
                    {paragraph}
                  </blockquote>
                );
              }
              return (
                <p key={index} className="first-letter:font-serif first-letter:text-stone-900">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Social Share Mock & Divider */}
          <div className="mt-12 pt-8 border-t border-stone-200 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Share Article:</span>
              <button className="p-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors cursor-pointer" title="Share via Email">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-stone-100 rounded-full text-stone-600 transition-colors cursor-pointer" title="Bookmark">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => setSelectedPost(null)}
              className="bg-stone-900 text-white hover:bg-[#7C8464] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer shadow-sm"
            >
              Back to Articles
            </button>
          </div>
        </article>
      ) : (
        // Blog List View
        <div className="space-y-16 animate-fade-in">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="w-16 h-[2px] bg-[#C5B592] mx-auto mb-4" />
            <span className="text-[#8C7D5F] font-serif italic text-sm md:text-base block uppercase tracking-widest">
              The Bihar Bite Journal
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-stone-900 leading-tight">
              Stories & Sourcing <span className="italic font-normal text-[#7C8464]">Heritage</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-light">
              Dive deep into the culture, health benefits, sustainable harvesting methods, and gourmet recipes surrounding India's legendary organic superfood.
            </p>
          </div>

          {/* Featured Hero Article Banner */}
          <div 
            onClick={() => setSelectedPost(featuredPost)}
            className="relative bg-stone-900 rounded-[40px] overflow-hidden group cursor-pointer border border-stone-800 shadow-xl min-h-[420px] md:min-h-[480px] flex items-end p-8 md:p-14"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="inline-block bg-[#C5B592] text-stone-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Featured Article
              </span>
              <h2 className="font-serif text-2xl md:text-4.5xl text-white font-light leading-tight group-hover:text-[#D4CBB5] transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-xs md:text-sm text-stone-300 max-w-2xl font-light leading-relaxed line-clamp-2">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-stone-400 font-medium">
                <span>By {featuredPost.author}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#C5B592] uppercase tracking-widest pt-2 group-hover:underline underline-offset-4">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Search and Filters bar */}
          <div className="border-y border-stone-200 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Horizontal Filter categories */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeCategory === category 
                      ? 'bg-stone-900 text-white shadow-sm' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Inline search bar */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#7C8464] transition-all font-sans text-stone-800"
              />
              <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          {/* Blog Bento Grid List */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full cursor-pointer"
                >
                  {/* Article Thumbnail */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-stone-100">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-serif text-xl text-stone-900 font-light leading-snug group-hover:text-[#7C8464] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed font-light line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-stone-100 mt-6 flex justify-between items-center">
                      <span className="text-[11px] text-stone-500 font-medium italic">
                        By {post.author.split(' ')[0]}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 uppercase tracking-widest group-hover:text-[#7C8464] transition-colors">
                        Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3 max-w-sm mx-auto">
              <p className="text-stone-400 text-sm italic">No matching journal articles found.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-[#7C8464] underline text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
