// Curated starter questions so the Question Bank isn't empty on first run.
// Run with: npm run seed (see package.json script)
module.exports = [
  // Data Structures & Algorithms
  {
    questionText: 'Explain the difference between an array and a linked list. When would you use one over the other?',
    category: 'Data Structures & Algorithms',
    difficulty: 'easy',
    tags: ['arrays', 'linked-list'],
  },
  {
    questionText: 'How would you detect a cycle in a linked list? Walk through your approach.',
    category: 'Data Structures & Algorithms',
    difficulty: 'medium',
    tags: ['linked-list', 'two-pointers'],
  },
  {
    questionText: 'Design an algorithm to find the kth largest element in an unsorted array. Discuss time complexity trade-offs.',
    category: 'Data Structures & Algorithms',
    difficulty: 'hard',
    tags: ['heap', 'quickselect'],
  },
  {
    questionText: 'What is the time complexity of common operations on a hash map, and how do collisions get handled?',
    category: 'Data Structures & Algorithms',
    difficulty: 'medium',
    tags: ['hashmap'],
  },

  // System Design
  {
    questionText: 'How would you design a URL shortening service like bit.ly?',
    category: 'System Design',
    difficulty: 'medium',
    tags: ['system-design', 'scalability'],
  },
  {
    questionText: 'Design a rate limiter for a public API. What algorithms could you use and what are the trade-offs?',
    category: 'System Design',
    difficulty: 'hard',
    tags: ['rate-limiting'],
  },
  {
    questionText: 'How would you design a scalable notification system (email, SMS, push) for millions of users?',
    category: 'System Design',
    difficulty: 'hard',
    company: 'Amazon',
    tags: ['messaging', 'scalability'],
  },

  // Behavioral
  {
    questionText: 'Tell me about a time you disagreed with a teammate on a technical decision. How did you resolve it?',
    category: 'Behavioral',
    difficulty: 'easy',
    tags: ['conflict-resolution'],
  },
  {
    questionText: 'Describe a project where you had to learn a new technology quickly. What was your approach?',
    category: 'Behavioral',
    difficulty: 'easy',
    tags: ['adaptability'],
  },
  {
    questionText: 'Tell me about a time you missed a deadline. What happened and what did you learn?',
    category: 'Behavioral',
    difficulty: 'medium',
    tags: ['ownership'],
  },

  // Database
  {
    questionText: 'What is database normalization, and can you walk through 1NF, 2NF, and 3NF with an example?',
    category: 'Database',
    difficulty: 'medium',
    tags: ['sql', 'normalization'],
  },
  {
    questionText: 'When would you choose a NoSQL database like MongoDB over a relational database like PostgreSQL?',
    category: 'Database',
    difficulty: 'medium',
    tags: ['nosql', 'sql'],
  },
  {
    questionText: 'Explain database indexing. How does it improve query performance, and what are the trade-offs?',
    category: 'Database',
    difficulty: 'medium',
    tags: ['indexing'],
  },

  // Operating Systems
  {
    questionText: 'What is the difference between a process and a thread?',
    category: 'Operating Systems',
    difficulty: 'easy',
    tags: ['processes', 'threads'],
  },
  {
    questionText: 'Explain deadlock. What are the four necessary conditions for it to occur, and how can it be prevented?',
    category: 'Operating Systems',
    difficulty: 'hard',
    tags: ['deadlock', 'concurrency'],
  },

  // Networking
  {
    questionText: 'Explain what happens when you type a URL into a browser and press Enter.',
    category: 'Networking',
    difficulty: 'medium',
    tags: ['http', 'dns'],
  },
  {
    questionText: 'What is the difference between TCP and UDP, and when would you use each?',
    category: 'Networking',
    difficulty: 'medium',
    tags: ['tcp', 'udp'],
  },

  // Frontend
  {
    questionText: 'Explain the virtual DOM in React and why it improves performance.',
    category: 'Frontend',
    difficulty: 'easy',
    tags: ['react'],
  },
  {
    questionText: 'What is the difference between controlled and uncontrolled components in React?',
    category: 'Frontend',
    difficulty: 'medium',
    tags: ['react', 'forms'],
  },
  {
    questionText: 'How does the browser event loop work, and how does it relate to promises and async/await?',
    category: 'Frontend',
    difficulty: 'hard',
    tags: ['javascript', 'event-loop'],
  },

  // Backend
  {
    questionText: 'How does JWT authentication work, and what are its advantages over session-based auth?',
    category: 'Backend',
    difficulty: 'medium',
    tags: ['auth', 'jwt'],
  },
  {
    questionText: 'What is middleware in Express.js, and how would you structure it in a large application?',
    category: 'Backend',
    difficulty: 'easy',
    tags: ['express', 'nodejs'],
  },
  {
    questionText: 'How would you handle a memory leak in a long-running Node.js server?',
    category: 'Backend',
    difficulty: 'hard',
    tags: ['nodejs', 'performance'],
  },

  // OOP & Design Patterns
  {
    questionText: 'Explain the four pillars of Object-Oriented Programming with real examples.',
    category: 'OOP & Design Patterns',
    difficulty: 'easy',
    tags: ['oop'],
  },
  {
    questionText: 'What is the Singleton pattern, and what are the risks of overusing it?',
    category: 'OOP & Design Patterns',
    difficulty: 'medium',
    tags: ['design-patterns'],
  },

  // General
  {
    questionText: 'How do you stay up to date with new technologies and industry trends?',
    category: 'General',
    difficulty: 'easy',
    tags: ['growth'],
  },
];
