/**
 * Speaker - Concrete implementation of Attendee
 * Represents an attendee who presents at events
 */
class Speaker extends Attendee {
    /**
     * Create a new Speaker
     * @param {Account} account - The associated account
     * @param {Array} interests - List of topics/areas of interest
     * @param {string} bio - Short biography or description
     * @param {string} expertise - Area of expertise
     */
    constructor(account, interests = [], bio = "", expertise = "") {
        super(account, interests, bio);
        this.expertise = expertise;
    }
    
    /**
     * Get attendee type
     * @returns {string} Type of attendee
     */
    getType() {
        return "Speaker";
    }
    /**
     * Get expertise of speaker
     * @returns - expertise string
     */
    getExpertise(){
        return this.expertise;
    }
    
    /**
     * Update speaker profile with professional information
     * @param {String} expertise - Updated profile information
     */
    setExpertise(expertise) {
        this.expertise = expertise;
        console.log("Speaker profile updated");
    }
}

export default Speaker;