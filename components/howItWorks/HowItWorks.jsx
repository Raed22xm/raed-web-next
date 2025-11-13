import React from 'react';

const HowItWorks = () => {
    const steps = [
        {
            number: 1,
            title: "Create Account",
            description: "Sign up in seconds"
        },
        {
            number: 2,
            title: "Upload Image",
            description: "Drag & drop your files"
        },
        {
            number: 3,
            title: "Auto Rescale",
            description: "AI processes instantly"
        },
        {
            number: 4,
            title: "Download",
            description: "Get your rescaled image"
        }
    ];

    return (
        <div className="how-it-works">
            <div className="how-it-works-header">
                <h2 className="how-it-works-title">How It Works</h2>
                <p className="how-it-works-subtitle">Simple, fast, and efficient.</p>
            </div>
            
            <div className="steps-container">
                {steps.map((step, index) => (
                    <div key={index} className="step">
                        <div className="step-icon">
                            {step.number}
                        </div>
                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-description">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;
