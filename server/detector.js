function analyzeContent(content) {

    const text = content.toLowerCase();

    let score = 0;
    let reasons = [];


    // ==========================================
    // 1. Urgent / threatening words
    // ==========================================

    const urgentWords = [
        "urgent",
        "immediately",
        "act now",
        "last warning",
        "verify now",
        "within 24 hours",
        "account will be blocked"
    ];

    for (const word of urgentWords) {

        if (text.includes(word)) {

            score += 15;

            reasons.push(
                "Urgent or threatening language detected."
            );

            break;
        }
    }


    // ==========================================
    // 2. Sensitive information requests
    // ==========================================

    const sensitiveWords = [
        "otp",
        "password",
        "pin",
        "cvv",
        "bank details",
        "card details",
        "login details"
    ];

    for (const word of sensitiveWords) {

        if (text.includes(word)) {

            score += 25;

            reasons.push(
                "Request for sensitive information detected."
            );

            break;
        }
    }


    // ==========================================
    // 3. KYC / Account related words
    // ==========================================

    const accountWords = [
        "kyc",
        "account blocked",
        "account suspended",
        "account closed",
        "verify your account",
        "update kyc"
    ];

    for (const word of accountWords) {

        if (text.includes(word)) {

            score += 15;

            reasons.push(
                "KYC or account-related warning detected."
            );

            break;
        }
    }


    // ==========================================
    // 4. Financial words
    // ==========================================

    const financialWords = [
        "payment",
        "refund",
        "upi",
        "lottery",
        "prize",
        "money",
        "transfer",
        "cashback"
    ];

    for (const word of financialWords) {

        if (text.includes(word)) {

            score += 10;

            reasons.push(
                "Financial or money-related content detected."
            );

            break;
        }
    }


    // ==========================================
    // 5. Extract URLs
    // ==========================================

    const urlPattern =
        /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

    const urls = content.match(urlPattern);


    if (urls) {

        for (let url of urls) {

            // Remove punctuation from end of URL
            url = url.replace(/[.,!?;:)]+$/, "");

            analyzeURL(url);

        }
    }


    // ==========================================
    // Keep score between 0 and 100
    // ==========================================

    score = Math.min(score, 100);


    // ==========================================
    // Determine risk level
    // ==========================================

    let level;

    if (score >= 70) {

        level = "HIGH";

    } else if (score >= 40) {

        level = "MEDIUM";

    } else {

        level = "LOW";
    }


    // ==========================================
    // No suspicious indicators
    // ==========================================

    if (reasons.length === 0) {

        reasons.push(
            "No major suspicious indicators detected."
        );
    }


    // ==========================================
    // Recommendation
    // ==========================================

    let recommendation;

    if (level === "HIGH") {

        recommendation =
            "Do not click suspicious links or share OTP, password, PIN, CVV or bank details. Verify the message using an official source.";

    } else if (level === "MEDIUM") {

        recommendation =
            "Be careful. Verify the sender and website before taking any action.";

    } else {

        recommendation =
            "No major suspicious indicators were detected. Still verify unexpected requests before sharing sensitive information.";
    }


    // ==========================================
    // Final result
    // ==========================================

    return {

        score: score,

        level: level,

        reasons: reasons,

        recommendation: recommendation

    };


    // ==========================================
    // URL Analysis Function
    // ==========================================

    function analyzeURL(url) {

        let urlLower = url.toLowerCase();


        // ------------------------------------------
        // Check HTTPS
        // ------------------------------------------

        if (
            urlLower.startsWith("http://")
        ) {

            score += 10;

            reasons.push(
                "URL does not use HTTPS."
            );

        } else if (
            urlLower.startsWith("https://")
        ) {

            // HTTPS is safer than HTTP.
            // It does NOT guarantee that a website is legitimate.

            reasons.push(
                "HTTPS connection detected, but HTTPS alone does not guarantee a trusted website."
            );
        }


        // ------------------------------------------
        // Check @ trick
        // ------------------------------------------

        if (url.includes("@")) {

            score += 20;

            reasons.push(
                "Suspicious @ symbol detected. It may hide the actual destination of the URL."
            );
        }


        // ------------------------------------------
        // Remove protocol for domain analysis
        // ------------------------------------------

        let domainPart = url
            .replace(/^https?:\/\//i, "")
            .replace(/^www\./i, "")
            .split("/")[0]
            .split("?")[0]
            .split("#")[0];


        // ------------------------------------------
        // Check IP address URL
        // ------------------------------------------

        const ipPattern =
            /^(\d{1,3}\.){3}\d{1,3}$/;

        if (ipPattern.test(domainPart)) {

            score += 25;

            reasons.push(
                "URL uses an IP address instead of a normal domain name."
            );
        }


        // ------------------------------------------
        // Check shortened URLs
        // ------------------------------------------

        const shortenedDomains = [
            "bit.ly",
            "tinyurl.com",
            "t.co",
            "goo.gl",
            "is.gd",
            "buff.ly",
            "ow.ly",
            "cutt.ly",
            "shorturl.at",
            "rebrand.ly"
        ];

        const domainOnly =
            domainPart.toLowerCase();

        if (
            shortenedDomains.includes(domainOnly)
        ) {

            score += 20;

            reasons.push(
                "URL uses a shortened-link service, which can hide the final destination."
            );
        }


        // ------------------------------------------
        // Check suspicious domain keywords
        // ------------------------------------------

        const suspiciousDomainWords = [
            "login",
            "verify",
            "verification",
            "secure",
            "security",
            "account",
            "update",
            "wallet",
            "payment",
            "banking",
            "free",
            "bonus",
            "reward",
            "prize",
            "claim",
            "gift"
        ];


        for (
            const word of suspiciousDomainWords
        ) {

            if (
                domainOnly.includes(word)
            ) {

                score += 10;

                reasons.push(
                    `Suspicious domain keyword detected: "${word}".`
                );

                break;
            }
        }


        // ------------------------------------------
        // Check excessive subdomains
        // ------------------------------------------

        const domainParts =
            domainPart.split(".");

        if (
            domainParts.length >= 5
        ) {

            score += 15;

            reasons.push(
                "Excessive subdomains detected in the URL."
            );
        }


        // ------------------------------------------
        // Check unusually long URL
        // ------------------------------------------

        if (
            url.length > 100
        ) {

            score += 10;

            reasons.push(
                "Unusually long URL detected."
            );
        }


        // ------------------------------------------
        // Check suspicious hyphens
        // ------------------------------------------

        const hyphenCount =
            (domainPart.match(/-/g) || []).length;

        if (
            hyphenCount >= 3
        ) {

            score += 10;

            reasons.push(
                "Multiple hyphens detected in the domain."
            );
        }


        // ------------------------------------------
        // Check unusual characters
        // ------------------------------------------

        if (
            /[<>{}\\|]/.test(url)
        ) {

            score += 10;

            reasons.push(
                "Unusual characters detected in the URL."
            );
        }

    }

}


// ==========================================
// Export Function
// ==========================================

module.exports = {
    analyzeContent
};