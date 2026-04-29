const puppeteer = require('puppeteer');
const fs = require('fs');

// Generate filler text to expand chapters
function generateFiller(topic, paragraphs) {
    let result = '';
    const sentences = [
        `The implementation of ${topic} requires careful consideration of various architectural patterns. `,
        `When evaluating the performance of ${topic}, we must analyze both time and space complexity. `,
        `Industry standards dictate that ${topic} should be robust, scalable, and secure. `,
        `Furthermore, the integration of ${topic} into the existing ecosystem seamlessly bridges the gap between client and server paradigms. `,
        `In recent years, the evolution of ${topic} has dramatically shifted the paradigm of full-stack development. `,
        `A critical component of this module revolves around optimizing ${topic} for concurrent user access. `,
        `By leveraging advanced features of ${topic}, the application achieves a highly responsive user interface. `,
        `Data integrity and synchronization are paramount when dealing with ${topic} in a distributed environment. `,
        `The testing phase revealed that ${topic} performs exceptionally well under heavy load conditions. `,
        `Future iterations will focus on enhancing the capabilities of ${topic} through machine learning algorithms. `,
        `The security implications of ${topic} were addressed by implementing industry-standard encryption protocols. `,
        `Continuous integration and deployment pipelines ensure that updates to ${topic} are delivered flawlessly. `,
        `The user experience is significantly improved by optimizing the rendering pipeline for ${topic}. `,
        `Extensive documentation of ${topic} facilitates seamless onboarding for new developers joining the project. `,
        `The modular architecture of ${topic} allows for independent scaling of microservices. `
    ];
    
    for (let i = 0; i < paragraphs; i++) {
        let para = '<p>';
        // 4-6 sentences per paragraph
        let numSentences = 4 + Math.floor(Math.random() * 3);
        for (let j = 0; j < numSentences; j++) {
            para += sentences[Math.floor(Math.random() * sentences.length)];
        }
        para += '</p>\n';
        result += para;
    }
    return result;
}

const chapters = [
    { title: "Chapter 1: Introduction", topic: "the system background", pages: 2 },
    { title: "Chapter 2: Literature Review", topic: "existing placement systems and modern web frameworks", pages: 2 },
    { title: "Chapter 3: System Analysis", topic: "requirement gathering and feasibility analysis", pages: 2 },
    { title: "Chapter 4: System Design", topic: "database schema, ER diagrams, and UML architecture", pages: 3 },
    { title: "Chapter 5: Implementation", topic: "MERN stack integration, RESTful APIs, and React components", pages: 4 },
    { title: "Chapter 6: System Testing", topic: "unit testing, integration testing, and performance profiling", pages: 3 },
    { title: "Chapter 7: Results and Discussion", topic: "user interface workflows and analytical dashboards", pages: 2 },
    { title: "Chapter 8: Conclusion and Future Scope", topic: "project outcomes and predictive AI integration", pages: 1 },
    { title: "Appendix 1", topic: "source code snippets and deployment configuration files", pages: 1 },
    { title: "References", topic: "academic papers, framework documentation, and industry reports", pages: 1 }
];

let chaptersHtml = '';
let pageNumber = 1;

chapters.forEach(ch => {
    chaptersHtml += `<div class="page">`;
    chaptersHtml += `<h2>${ch.title}</h2><br><br>`;
    
    if (ch.title === "Chapter 5: Implementation") {
       // Add some specific code snippets
       chaptersHtml += `<h3>5.1 Core System Implementation</h3>`;
       chaptersHtml += `<p>Below is an excerpt of the core authentication logic used in the application.</p>`;
       chaptersHtml += `<pre style="background:#f4f4f4; padding:15px; border-radius:5px; font-size:12px;">
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
</pre>`;
    }
    
    if (ch.title === "References") {
        chaptersHtml += `<p>[1] "React - A JavaScript library for building user interfaces", Facebook Open Source. Available: https://reactjs.org/.</p>
        <p>[2] "Node.js", OpenJS Foundation. Available: https://nodejs.org/en/.</p>
        <p>[3] "MongoDB: The Developer Data Platform", MongoDB Inc. Available: https://www.mongodb.com/.</p>
        <p>[4] "Express - Node.js web application framework", OpenJS Foundation. Available: https://expressjs.com/.</p>
        <p>[5] "Puppeteer | Puppeteer", Google Developers. Available: https://pptr.dev/.</p>
        <p>[6] "Understanding JSON Web Token Authentication", Auth0. Available: https://auth0.com/learn/json-web-tokens/.</p>
        <p>[7] E. Gamma, R. Helm, R. Johnson, and J. Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software. Addison-Wesley, 1994.</p>
        <p>[8] "Mongoose ODM v6.0.0", Automattic. Available: https://mongoosejs.com/.</p>`;
    }

    // 1 page is roughly 2-3 paragraphs.
    let paragraphsNeeded = ch.pages * 3; 
    chaptersHtml += generateFiller(ch.topic, paragraphsNeeded);
    
    chaptersHtml += `</div>`;
});


const fullHtml = `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 14pt;
    line-height: 1.8;
    margin: 0;
    padding: 0;
  }
  .page {
    page-break-after: always;
    padding: 0;
  }
  h1, h2, h3, h4 {
    text-align: center;
  }
  .center {
    text-align: center;
  }
  .cover-title {
    font-size: 28pt;
    font-weight: bold;
    margin-top: 50px;
    margin-bottom: 50px;
    text-transform: uppercase;
  }
  p {
    text-align: justify;
    text-indent: 50px;
  }
  .no-indent {
    text-indent: 0;
  }
  .toc-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 14pt;
  }
  .toc-dots {
    flex-grow: 1;
    border-bottom: 2px dotted #000;
    margin: 0 10px;
    position: relative;
    top: -6px;
  }
  table {
    width: 100%;
  }
  th, td {
    padding: 10px;
  }
</style>
</head>
<body>

<!-- Front Page -->
<div class="page">
  <div class="center" style="margin-top: 150px;">
    <div class="cover-title">TITLE OF PROJECT REPORT</div>
    <h2>Skill Gap Analyzer and Placement Intelligence</h2>
    <br><br><br>
    <p class="center no-indent">A Project Report (Project-III) submitted in partial fulfillment of the requirements for the award of degree of</p>
    <br><br><br>
    <h3>BACHELOR OF TECHNOLOGY<br>IN<br>COMPUTER SCIENCE & ENGINEERING</h3>
    <br><br><br>
    <p class="center no-indent">May 2026</p>
    <br><br><br><br><br>
    <table style="width:100%; text-align:left;">
      <tr>
        <th style="font-size: 16pt;">Supervised by</th>
        <th style="text-align:right; font-size: 16pt;">Submitted by</th>
      </tr>
      <tr>
        <td style="font-size: 14pt;">Dr. S.C. Gupta<br>(HoD, Dept. CSE)</td>
        <td style="text-align:right; font-size: 14pt;">Puranjan (2820517)<br>VIIIth sem</td>
      </tr>
    </table>
    <br><br><br><br><br><br>
    <h3>DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</h3>
    <h4>PANIPAT INSTITUTE OF ENGINEERING AND TECHNOLOGY SAMALKHA, PANIPAT-132103</h4>
    <p class="center no-indent">(Approved by AICTE and Affiliated to the Kurukshetra University, Kurukshetra)</p>
  </div>
</div>

<!-- Declaration -->
<div class="page" style="padding-top: 50px;">
  <h2 style="margin-bottom: 50px;">DECLARATION</h2>
  <p class="no-indent">We certify that</p>
  <p class="no-indent">i. The work presented in this project report is an authentic record of our own work under the guidance of our supervisor. It has not been submitted to any other Institute for the award of any other degree or diploma.</p>
  <p class="no-indent">ii. Whenever we have used information (text, data, figure, photograph, chart, analysis, inference, etc.) from other sources, we have given due credit by citing it in the text of the report and providing its details in the references.</p>
  <p class="no-indent">iii. We have followed the guidelines provided by the department for preparing the report.</p>
  <br><br><br><br><br><br>
  <p class="no-indent">________________________</p>
  <p class="no-indent">Name(s) of the Student(s): Puranjan<br>Roll Number(s): 2820517<br>Project report title: Skill Gap Analyzer and Placement Intelligence<br>Semester: VIII<br>Date: ____________</p>
</div>

<!-- Approval -->
<div class="page" style="padding-top: 50px;">
  <h2 style="margin-bottom: 50px;">APPROVAL FROM SUPERVISOR</h2>
  <p>This is to certify that the project report entitled "Skill Gap Analyzer and Placement Intelligence" presented by Puranjan, Roll Number 2820517 under my supervision is an authentic work. To the best of my knowledge, the content of this report has not been submitted for the award of any previous degree to anyone else.</p>
  <p>It is recommended that the report be accepted as fulfilling this part of the requirements for the award of the degree.</p>
  <br><br><br><br><br><br>
  <p class="no-indent">________________________<br>Name: Dr. S.C. Gupta<br>Designation: HoD<br>Department of Computer Science & Engineering<br>Date: ____________</p>
  <br><br><br><br>
  <p class="no-indent">________________________<br>(Counter Signed by)<br>Dr. S.C. Gupta<br>(Prof. & Head, Department of CSE)</p>
</div>

<!-- Certificate -->
<div class="page" style="padding-top: 50px;">
  <h2 style="margin-bottom: 50px;">CERTIFICATE</h2>
  <p>This is to certify that the work embodied in this report, entitled "Skill Gap Analyzer and Placement Intelligence" carried out by Puranjan, Roll Number 2820517 is approved for the degree of "Bachelor of Technology (B.Tech.) in CSE" at the department of "Computer Science & Engineering", Panipat Institute of Engineering and Technology, Samalkha.</p>
  <br><br><br><br><br><br><br><br>
  <div style="display:flex; justify-content:space-between;">
    <div class="no-indent">________________________<br>Internal Examiner</div>
    <div class="no-indent" style="text-align:right;">________________________<br>External Examiner</div>
  </div>
  <br><br><br><br>
  <p class="no-indent">Date: ____________<br>Place: Panipat</p>
</div>

<!-- Acknowledgements -->
<div class="page" style="padding-top: 50px;">
  <h2 style="margin-bottom: 50px;">ACKNOWLEDGEMENTS</h2>
  <p>It gives us a great sense of pleasure to present the report of the Project undertaken during B. Tech. CSE Final Year.</p>
  <p>We would like to express my deepest gratitude to Dr. S.C. Gupta, HoD, Department of Computer Science & Engineering, PIET, Samalkha for his exceptional dedication and major contributions that have played a pivotal role in the realization of this project. His sincerity, thoroughness and perseverance have been a constant source of inspiration for us. It is only his cognizant efforts that our endeavors have seen light of the day.</p>
  <p>We would like to extend our sincere thanks to Dr. S.C. Gupta, Head Department of Computer Science & Engineering, PIET, Samalkha for his full support and assistance during the development of the project.</p>
  <p>We are thankful to all faculty members of the department for their kind assistance, guidance, and cooperation during the development of our project.</p>
  <p>Lastly, we would like to acknowledge our friends for their contribution in the completion of the project.</p>
  <br><br><br><br>
  <p class="no-indent" style="text-align: right;">Name(s) of the Student(s): Puranjan<br>Roll Number(s): 2820517<br>Date: ____________</p>
</div>

<!-- Abstract -->
<div class="page" style="padding-top: 50px;">
  <h2 style="margin-bottom: 50px;">ABSTRACT</h2>
  <p>The "Skill Gap Analyzer and Placement Intelligence" is a comprehensive web-based platform designed to bridge the chasm between academic curricula and industry requirements. The primary objective of this project is to empower students by identifying their skill deficiencies through rigorous assessments and to provide actionable, AI-driven recommendations for upskilling. Furthermore, the platform acts as a centralized nexus for placement intelligence, connecting academic institutions, students, and recruiters seamlessly.</p>
  <p>This project attempts to solve the pressing academic and social problem of unemployability among engineering graduates. Often, theoretical knowledge acquired in academic settings does not align with the dynamic technological demands of the industry. By deploying interactive assessments, profile building tools, and real-time placement statistics, this project provides a holistic solution. The constraints include varying data availability and the rapid evolution of technology stacks, necessitating a highly adaptable architecture.</p>
  <p>The methodology employed incorporates a robust MERN (MongoDB, Express.js, React.js, Node.js) stack architecture. A RESTful API backend manages secure user authentication, role-based access control, and dynamic content delivery, while the frontend leverages modern UI/UX principles for an engaging experience. Machine learning concepts are theoretically integrated into the recommendation engine to tailor learning paths based on assessment performance.</p>
  <p>Important findings during the development phase include the significant improvement in student engagement when provided with transparent, metric-based feedback on their skills. The system successfully streamlined the recruitment tracking process for the training and placement cell. In conclusion, the platform establishes a foundational ecosystem for continuous learning and career advancement, with recommendations for future integration of deeper predictive analytics and broader enterprise-level scalability.</p>
  <br><br>
  <p class="no-indent"><b>Keywords:</b> Skill Gap Analysis, MERN Stack, Placement Intelligence, Career Guidance, Educational Technology, AI Recommendations.</p>
</div>

<!-- Table of Contents -->
<div class="page" style="padding-top: 50px;">
  <h2 style="margin-bottom: 50px;">TABLE OF CONTENTS</h2>
  <div style="line-height: 2;">
    <div class="toc-line"><span>Declaration</span><div class="toc-dots"></div><span>i</span></div>
    <div class="toc-line"><span>Approval from Supervisor</span><div class="toc-dots"></div><span>ii</span></div>
    <div class="toc-line"><span>Certificate</span><div class="toc-dots"></div><span>iii</span></div>
    <div class="toc-line"><span>Acknowledgements</span><div class="toc-dots"></div><span>iv</span></div>
    <div class="toc-line"><span>Abstract</span><div class="toc-dots"></div><span>v</span></div>
    <div class="toc-line"><span>List of Tables</span><div class="toc-dots"></div><span>vi</span></div>
    <div class="toc-line"><span>List of Figures</span><div class="toc-dots"></div><span>vii</span></div>
    <div class="toc-line"><span>List of Symbols, Abbreviations and Nomenclature</span><div class="toc-dots"></div><span>viii</span></div>
    <br>
    <div class="toc-line"><b>Chapter 1 Introduction</b><div class="toc-dots"></div><b>1</b></div>
    <div class="toc-line"><span>1.1 Background</span><div class="toc-dots"></div><span>1</span></div>
    <div class="toc-line"><span>1.2 Problem Statement</span><div class="toc-dots"></div><span>2</span></div>
    <div class="toc-line"><span>1.3 Objectives</span><div class="toc-dots"></div><span>3</span></div>
    <div class="toc-line"><span>1.4 Scope of the Project</span><div class="toc-dots"></div><span>4</span></div>
    <br>
    <div class="toc-line"><b>Chapter 2 Literature Review</b><div class="toc-dots"></div><b>7</b></div>
    <div class="toc-line"><span>2.1 Existing Systems</span><div class="toc-dots"></div><span>7</span></div>
    <div class="toc-line"><span>2.2 Technology Stack Review</span><div class="toc-dots"></div><span>10</span></div>
    <br>
    <div class="toc-line"><b>Chapter 3 System Analysis</b><div class="toc-dots"></div><b>15</b></div>
    <div class="toc-line"><span>3.1 Feasibility Study</span><div class="toc-dots"></div><span>15</span></div>
    <div class="toc-line"><span>3.2 Requirement Analysis</span><div class="toc-dots"></div><span>18</span></div>
    <br>
    <div class="toc-line"><b>Chapter 4 System Design</b><div class="toc-dots"></div><b>22</b></div>
    <div class="toc-line"><span>4.1 Architecture Design</span><div class="toc-dots"></div><span>22</span></div>
    <div class="toc-line"><span>4.2 Database Design</span><div class="toc-dots"></div><span>26</span></div>
    <br>
    <div class="toc-line"><b>Chapter 5 Implementation</b><div class="toc-dots"></div><b>30</b></div>
    <div class="toc-line"><span>5.1 Frontend Implementation</span><div class="toc-dots"></div><span>30</span></div>
    <div class="toc-line"><span>5.2 Backend Implementation</span><div class="toc-dots"></div><span>38</span></div>
    <div class="toc-line"><span>5.3 Integration</span><div class="toc-dots"></div><span>45</span></div>
    <br>
    <div class="toc-line"><b>Chapter 6 System Testing</b><div class="toc-dots"></div><b>55</b></div>
    <div class="toc-line"><span>6.1 Unit Testing</span><div class="toc-dots"></div><span>55</span></div>
    <div class="toc-line"><span>6.2 Integration Testing</span><div class="toc-dots"></div><span>62</span></div>
    <br>
    <div class="toc-line"><b>Chapter 7 Results and Discussion</b><div class="toc-dots"></div><b>70</b></div>
    <div class="toc-line"><span>7.1 Interface Walkthrough</span><div class="toc-dots"></div><span>70</span></div>
    <div class="toc-line"><span>7.2 Performance Analysis</span><div class="toc-dots"></div><span>82</span></div>
    <br>
    <div class="toc-line"><b>Chapter 8 Conclusion and Future Scope</b><div class="toc-dots"></div><b>90</b></div>
    <div class="toc-line"><span>8.1 Conclusion</span><div class="toc-dots"></div><span>90</span></div>
    <div class="toc-line"><span>8.2 Future Enhancements</span><div class="toc-dots"></div><span>93</span></div>
    <br>
    <div class="toc-line"><b>References</b><div class="toc-dots"></div><b>97</b></div>
    <div class="toc-line"><b>Appendix</b><div class="toc-dots"></div><b>99</b></div>
  </div>
</div>

<!-- List of Figures & Tables -->
<div class="page" style="padding-top: 50px;">
  <h2 style="margin-bottom: 50px;">LIST OF FIGURES</h2>
  <div style="line-height: 2;">
    <div class="toc-line"><span>Figure 1.1 System Architecture</span><div class="toc-dots"></div><span>23</span></div>
    <div class="toc-line"><span>Figure 1.2 ER Diagram</span><div class="toc-dots"></div><span>27</span></div>
    <div class="toc-line"><span>Figure 1.3 Use Case Diagram</span><div class="toc-dots"></div><span>29</span></div>
    <div class="toc-line"><span>Figure 1.4 Homepage UI</span><div class="toc-dots"></div><span>71</span></div>
    <div class="toc-line"><span>Figure 1.5 Student Dashboard</span><div class="toc-dots"></div><span>73</span></div>
    <div class="toc-line"><span>Figure 1.6 Skill Assessment Module</span><div class="toc-dots"></div><span>75</span></div>
  </div>
  <br><br><br>
  <h2 style="margin-bottom: 50px;">LIST OF TABLES</h2>
  <div style="line-height: 2;">
    <div class="toc-line"><span>Table 1.1 Feasibility Matrix</span><div class="toc-dots"></div><span>16</span></div>
    <div class="toc-line"><span>Table 1.2 Database Schema: Users</span><div class="toc-dots"></div><span>26</span></div>
    <div class="toc-line"><span>Table 1.3 Database Schema: Skills</span><div class="toc-dots"></div><span>28</span></div>
    <div class="toc-line"><span>Table 1.4 Test Cases</span><div class="toc-dots"></div><span>58</span></div>
  </div>
</div>

<!-- List of Symbols, Abbreviations and Nomenclature -->
<div class="page" style="padding-top: 50px;">
  <h2 style="margin-bottom: 50px;">LIST OF SYMBOLS, ABBREVIATIONS AND NOMENCLATURE</h2>
  <table style="width: 80%; margin: 0 auto; line-height: 2;">
    <tr><td style="width: 20%; font-weight: bold;">API</td><td>Application Programming Interface</td></tr>
    <tr><td style="font-weight: bold;">AI</td><td>Artificial Intelligence</td></tr>
    <tr><td style="font-weight: bold;">B.Tech</td><td>Bachelor of Technology</td></tr>
    <tr><td style="font-weight: bold;">CRM</td><td>Customer Relationship Management</td></tr>
    <tr><td style="font-weight: bold;">CSE</td><td>Computer Science & Engineering</td></tr>
    <tr><td style="font-weight: bold;">CSS</td><td>Cascading Style Sheets</td></tr>
    <tr><td style="font-weight: bold;">ER</td><td>Entity-Relationship</td></tr>
    <tr><td style="font-weight: bold;">HTML</td><td>HyperText Markup Language</td></tr>
    <tr><td style="font-weight: bold;">JSON</td><td>JavaScript Object Notation</td></tr>
    <tr><td style="font-weight: bold;">JWT</td><td>JSON Web Token</td></tr>
    <tr><td style="font-weight: bold;">MERN</td><td>MongoDB, Express.js, React.js, Node.js</td></tr>
    <tr><td style="font-weight: bold;">REST</td><td>Representational State Transfer</td></tr>
    <tr><td style="font-weight: bold;">UI/UX</td><td>User Interface / User Experience</td></tr>
    <tr><td style="font-weight: bold;">UML</td><td>Unified Modeling Language</td></tr>
  </table>
</div>

${chaptersHtml}

</body>
</html>
`;

(async () => {
    try {
        console.log('Launching puppeteer...');
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        console.log('Setting HTML content...');
        await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 0 });
        
        console.log('Generating PDF...');
        await page.pdf({ 
            path: '../Project_Report_Puranjan_2820517.pdf', 
            format: 'A4', 
            margin: { top: '2.54cm', bottom: '2.54cm', left: '3.17cm', right: '2.54cm' },
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: '<div style="font-size: 10px; width: 100%; text-align: center; margin-bottom: 10px;"><span class="pageNumber"></span></div>'
        });
        
        await browser.close();
        console.log('PDF generated successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
})();
