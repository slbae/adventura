module.exports = class Itinerary {
    id = null;
    country = null;
    city = null;
    startdate = null;
    enddate = null;
    author = null;
    budget = null;
    collaborator = null;
    schedule = null;

    constructor(data) {
      this.id = data.iti_id;
      this.country = data.iti_country;
      this.city = data.iti_city;
      this.startdate = data.iti_startdate;
      this.enddate = data.iti_enddate;
      this.author = data.iti_author;
      this.budget = data.iti_budget;
      this.collaborator = data.iti_collaborator;
      this.schedule = data.iti_schedule;
    }

    toJSON() {
        return {
          id: this.id,
          country: this.country,
          city: this.city,
          startdate: this.startdate,
          enddate: this.enddate,
          author: this.author,
          budget: this.budget,
          collaborator: this.collaborator,
          schedule: this.schedule
        }
      }
  
};