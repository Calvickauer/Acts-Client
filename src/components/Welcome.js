import React from 'react';

const Welcome = () => {
    return (
        <div className="welcome-container">
            <header className="welcome-header">
                <h1>Welcome to the A.C.T.S. Community</h1>
                <p>Connecting hearts and strengthening faith through Adoration, Community, Theology, and Service.</p>
            </header>
            <main className="welcome-content">
                <section>
                    <h2>About A.C.T.S. Retreats</h2>
                    <p>An ACTS retreat is a three-day, three-night Catholic lay retreat that aims to help participants strengthen their relationship with God and their parish community. The retreat is guided by Roman Catholic Church teachings and Holy Scripture, and focuses on the following areas:</p>
                    <ul>
                        <li><strong>Adoration:</strong> Responding to, accepting, and calling out to God</li>
                        <li><strong>Community:</strong> Caring for and loving each other</li>
                        <li><strong>Theology:</strong> Studying God through the Catholic Faith and scripture</li>
                        <li><strong>Service:</strong> Serving God and his people</li>
                    </ul>
                </section>
                <section>
                    <h2>Our Mission</h2>
                    <p>Our mission is to provide a platform for participants to stay connected with their newfound community, support each other in faith, and continue their spiritual journey together.</p>
                </section>
            </main>
        </div>
    );
};

export default Welcome;
