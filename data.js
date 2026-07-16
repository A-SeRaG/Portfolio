window.DEFAULT_PORTFOLIO_DATA = {
    hero: {
        name: "AHMED SERAG HAMED",
        titles: "Full-Stack Developer • AI & Robotics Instructor • STEAM Education Specialist",
        summary: "Full-Stack Developer, AI & Robotics Instructor, and STEAM Curriculum Developer with experience in software engineering, educational technology, and technical training. Skilled in Python, JavaScript, React, Node.js, AI fundamentals, robotics, and curriculum design. Passionate about building technology-driven learning experiences and developing innovative educational solutions.",
        photos: [
            "assets/hero_bg.png" // default placeholder path
        ]
    },
    specializations: [
        {
            id: "devops",
            icon: "fa-solid fa-server",
            title: "DevOps Engineer",
            description: "Deploying scalable server infrastructures, automating configurations, hardening web security, and engineering high-availability topologies.",
            details: [
                "Hands-on configuration orchestration using Puppet agents.",
                "Reverse proxies, load balancers (HAProxy), and Nginx server design.",
                "Administering web security standards, SSH key architectures, and SSL/TLS setups.",
                "Debugging networking stacks and writing postmortems for high-severity incidents."
            ]
        },
        {
            id: "edtech",
            icon: "fa-solid fa-graduation-cap",
            title: "EdTech Specialist",
            description: "Crafting comprehensive tech curricula, training engineering instructors, coaching national robotics teams, and lecturing on IoT systems.",
            details: [
                "Drafting structured STEAM courses covering programming, automation, and AI for ages 6-15.",
                "Teaching smart city concepts, electronic wiring, and digital fabrication (3D modeling).",
                "Coaching students in national/international robotics competitions (WeDo Challenge, Robo Challenge).",
                "Training instructors on pedagogy and implementation of interactive STEAM labs."
            ]
        },
        {
            id: "fullstack",
            icon: "fa-solid fa-code",
            title: "FullStack Engineer",
            description: "Developing responsive front-ends, scaling backend APIs, designing databases, and translating requirements into software.",
            details: [
                "Building responsive interfaces in React.js, HTML5, CSS3, and JavaScript.",
                "Developing backend services using Node.js, Express, and RESTful paradigms.",
                "Designing and managing relational databases with SQL, MySQL, and ORM tools (Sequelize).",
                "Mastering core software engineering principles, algorithms, and data structures in C and Python."
            ]
        },
        {
            id: "datascience",
            icon: "fa-solid fa-brain",
            title: "Data Science Engineer",
            description: "Applying data science paradigms, Python analytical tools, and machine learning models to solve business challenges.",
            details: [
                "Trained at the University of Tokyo (GCI World by Matsuo-Iwasawa Lab) in data science.",
                "Conducting statistical analytics, data preprocessing, and modeling using Python libraries.",
                "Developing predictive systems and classification algorithms for corporate business metrics.",
                "Resolving business objectives by extracting intelligence from large structured datasets."
            ]
        }
    ],
    skills: {
        technical: [
            "Python", "JavaScript", "ReactJS", "NodeJS", "C", "C++",
            "SQL", "MySQL", "ORM", "Web Development", "AI & Machine Learning",
            "Linux", "Puppet", "HAProxy", "Nginx", "Git", "Problem Solving"
        ],
        soft: [
            "Attention to Detail", "Time Management", "Project Management",
            "Leadership", "Continuous Learning", "Team Mentoring"
        ],
        languages: [
            { name: "Arabic", level: "Native" },
            { name: "English", level: "C1 (Advanced)" },
            { name: "German", level: "Beginner" }
        ]
    },
    projects: [
        {
            id: 1,
            title: "Smart Cities IoT Prototype",
            desc: "Designed and built a model Smart City grid combining sensors, automation microcontrollers, and real-time dashboard visualization.",
            tags: "IoT, C++, Arduino, WebSockets",
            image: "assets/edtech_banner.png",
            link: "https://github.com/A-SeRaG"
        },
        {
            id: 2,
            title: "E-Commerce Backend REST API",
            desc: "A scalable RESTful API with user authentication, secure database endpoints, payment simulation, and route optimizations.",
            tags: "Node.js, Express, MySQL, Sequelize",
            image: "assets/software_banner.png",
            link: "https://github.com/A-SeRaG"
        },
        {
            id: 3,
            title: "Data Science Predictive Modeling",
            desc: "Developed a Python machine learning system predicting sales trends, designed as part of the University of Tokyo GCI program.",
            tags: "Python, Pandas, Scikit-learn, ML",
            image: "assets/hero_bg.png",
            link: "https://github.com/A-SeRaG"
        }
    ],
    certificates: [
        {
            id: 1,
            title: "GCI World - Data Science Certificate",
            issuer: "University of Tokyo (Matsuo-Iwasawa Lab)",
            date: "Jul 2026",
            link: "#"
        },
        {
            id: 2,
            title: "Full-Stack Software Engineering Diploma",
            issuer: "ALX Africa",
            date: "Jan 2025",
            link: "#"
        },
        {
            id: 3,
            title: "Founder Academy Business Certificate",
            issuer: "ALX Africa",
            date: "Oct 2024",
            link: "#"
        }
    ],
    timeline: [
        {
            id: 1,
            stage: "juniority",
            title: "High School Graduation",
            subtitle: "Secondary School Certification",
            date: "Jun 2021",
            text: "Graduated with honors. Developed a strong interest in physical electronics and logical programming during high school projects.",
            image: "",
            link: ""
        },
        {
            id: 2,
            stage: "juniority",
            title: "First Robotics Project",
            subtitle: "Self-Guided Learning",
            date: "Mar 2020",
            text: "Built a basic obstacle-avoiding vehicle using Arduino, infrared sensors, and C++ scripting. Sparked passion for robotics instruction.",
            image: "",
            link: ""
        },
        {
            id: 3,
            stage: "seniority",
            title: "Helwan University B.Sc.",
            subtitle: "Faculty of Engineering (Communication & Electronics)",
            date: "Aug 2021 - Jun 2026",
            text: "Completed a comprehensive engineering curriculum covering communication networking, digital systems design, electronics, and digital signal diagnostics.",
            image: "",
            link: ""
        },
        {
            id: 4,
            stage: "seniority",
            title: "ALX Africa Software Engineer",
            subtitle: "Rigorous Full-Stack Specialization",
            date: "Aug 2023 - Jan 2025",
            text: "Completed full-stack computer science training. Mastered software principles, database schemas, server environments, and configuration scripts.",
            image: "",
            link: ""
        },
        {
            id: 5,
            stage: "seniority",
            title: "EduZone Curriculum Developer",
            subtitle: "STEAM Education Specialist",
            date: "Jun 2025 - Feb 2026",
            text: "Designed curricula in programming, AI, and robotics. Coached student teams in robotics competitions (WeDo Challenge, Robo Challenge) and hosted workshops.",
            image: "",
            link: ""
        },
        {
            id: 6,
            stage: "seniority",
            title: "STEAM Instructor at San3a Academy",
            subtitle: "Onsite Lecture Contract",
            date: "Feb 2026 - Present",
            text: "Instructing Smart Cities, IoT, digital fabrication, and block-based/text-based coding. Mentoring student teams in competition pipelines from prototyping to judging.",
            image: "",
            link: ""
        },
        {
            id: 7,
            stage: "seniority",
            title: "University of Tokyo GCI",
            subtitle: "Data Science & Machine Learning",
            date: "Apr 2026 - Jul 2026",
            text: "Practiced advanced data science concepts, machine learning modeling, and business operations analytics with Matsuo-Iwasawa Lab.",
            image: "",
            link: ""
        }
    ],
    hobbies: [
        {
            id: 1,
            icon: "fa-solid fa-gamepad",
            title: "Creative Coding & Gaming",
            desc: "Developing mini-games in Python and Scratch to demonstrate physics, dynamics, and logic concepts."
        },
        {
            id: 2,
            icon: "fa-solid fa-chess",
            title: "Chess & Strategy",
            desc: "Playing strategic board games to exercise analytical thinking and structural planning under time constraints."
        },
        {
            id: 3,
            icon: "fa-solid fa-book-open",
            title: "Scientific Literature",
            desc: "Reading research papers in artificial intelligence, robotics, and educational technology paradigms."
        },
        {
            id: 4,
            icon: "fa-solid fa-camera",
            title: "Photography",
            desc: "Capturing patterns in urban cityscapes, robotics prototyping labs, and electronic assemblies to explore structural design."
        }
    ],
    contact: {
        email: "me@serag.info",
        phone: "(20) 1141822732",
        address: "9st. Maadi - Cairo, Egypt",
        linkedin: "https://www.linkedin.com/in/a7med-serag/",
        github: "https://github.com/A-SeRaG"
    }
};
