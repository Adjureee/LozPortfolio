const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/monitor-os/static/js/main.fe030160.js');
let code = fs.readFileSync(filePath, 'utf8');

// Replace Subtitle
code = code.replace(/"Software Engineer"/g, '"As an aspiring fullstack dev"');

// Replace Hover Experience
code = code.replace(/"Hover"/g, '"DNSC E-Request Management System"');
code = code.replace(/"Frontend Engineer"/g, '"Fullstack Developer"');
code = code.replace(/"Summer 2020 - Fall 2021"/g, '"Aug 2023 - Dec 2023"');
code = code.replace(/"Targeted towards online content creators and streamers looking to build a brand, Hover is the home of over 150K users\. Written in Typescript using React, React-Native, Framer, Express, and Redux\."/g, '"A web-based system designed to manage and track electronic requests within DNSC."');
code = code.replace(/"Architected and engineered the vertical scrolling discover player which, at its daily peak, was responsible for generating over 600,000 views across 20,000 active users\."/g, '"Developed core features to streamline the request process and improve efficiency."');
code = code.replace(/"Designed and implemented multiple features to increase app usability and user experience while ensuring the quality, maintainability and scalability of the front end as the user base grew by over 50,000\."/g, '"Ensured the system was scalable and maintainable for future updates."');
code = code.replace(/"Coordinated major refactors targeted towards app optimization and performance resulting in a smoother user experience and accomplished by eliminating redundant re-renders and API calls by over 50%\."/g, '"Collaborated with a team to build out the full stack."');

// Replace Clever Experience (if we want to replace Henry's other experiences with Lozada's other experiences)
// Lozada has "LGU LG-Datacom System"
code = code.replace(/"Clever"/g, '"LGU LG-Datacom System"');
code = code.replace(/"Software Engineering Intern"/g, '"Fullstack Developer"');
code = code.replace(/"Summer 2021"/g, '"June 2023 - Aug 2023"');
code = code.replace(/"Clever is a digital learning platform utilized by over 65% of US K-12 schools\. I joined the Secure Sync team, which is responsible for the core data pipeline that syncs student and teacher data from school districts to educational applications\."/g, '"Developed a robust web application for the Local Government Unit."');

// Replace Pintrest Experience
code = code.replace(/"Pinterest"/g, '"Freelance Web Developer"');
code = code.replace(/"Spring 2021"/g, '"Jan 2022 - Present"');
code = code.replace(/"Pinterest is a visual discovery engine for finding ideas like recipes, home and style inspiration, and more\. I joined the Growth team, which is responsible for driving user acquisition and retention\."/g, '"Created responsive websites for various clients."');

// About text (replacing a snippet to test)
code = code.replace(/I got an internship working for the startup Hover, primarily focusing on frontend work\. I continued to work at Hover on and off for about a year and a half, until the start of my senior year when I decided to focus on other opportunities\./g, 'I have been developing fullstack applications using modern technologies to build solid and scalable solutions.');
code = code.replace(/Hello! I'm Henry/g, "Hello! I'm John Lyold");

fs.writeFileSync(filePath, code);
console.log('Content replaced successfully!');
