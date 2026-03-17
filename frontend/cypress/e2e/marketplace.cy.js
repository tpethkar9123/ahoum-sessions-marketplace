describe('SpiritualTech Marketplace E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page and show sessions', () => {
    cy.contains('Find Your Inner Balance').should('be.visible');
    cy.contains('Available Sessions').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.contains('Get Started').click();
    cy.url().should('include', '/login');
    cy.contains('Welcome Back').should('be.visible');
  });

  it('should allow dev login as creator and create a session', () => {
    cy.intercept('POST', '**/auth/oauth/').as('loginReq');
    cy.intercept('POST', '**/sessions/').as('createSessionReq');
    
    cy.visit('/login');
    cy.contains('Creator').click();
    cy.contains('Continue with Dev Account').click();
    
    cy.wait('@loginReq').its('response.statusCode').should('eq', 200);
    
    // Check if on dashboard
    cy.url({ timeout: 10000 }).should('include', '/creator-dashboard');
    cy.contains('Creator Dashboard').should('be.visible');

    // Create a new session
    cy.contains('Create Session').click();
    cy.get('input[type="text"]').type('Cypress Testing Session');
    cy.get('textarea').type('Automated E2E testing using Cypress');
    cy.get('input[type="date"]').type('2026-12-31');
    cy.get('input[type="time"]').type('10:00');
    cy.get('input[type="number"]').type('99');
    // Image is optional, so we skip it for simplicity in E2E
    
    cy.contains('Publish Session').click();
    cy.wait('@createSessionReq').its('response.statusCode').should('eq', 201);
    cy.contains('Cypress Testing Session').should('be.visible');
  });

  it('should allow dev login as user and book a session', () => {
    cy.intercept('POST', '**/auth/oauth/').as('loginReqUser');
    cy.intercept('POST', '**/payments/create-intent/').as('paymentReq');
    cy.intercept('POST', '**/bookings/').as('bookReq');
    
    cy.visit('/login');
    cy.contains('User').click();
    cy.contains('Continue with Dev Account').click();
    
    cy.wait('@loginReqUser');
    cy.url({ timeout: 10000 }).should('include', '/user-dashboard');
    
    cy.visit('/'); // Go to home to find a session
    
    // Find a session and view it
    cy.contains('View Details', { timeout: 10000 }).first().click();
    cy.url().should('include', '/sessions/');
    
    // Book it (this triggers payment intent + alert + booking)
    cy.contains('Book Now').click();
    
    cy.wait('@paymentReq').its('response.statusCode').should('eq', 200);
    cy.wait('@bookReq').its('response.statusCode').should('eq', 201);
    
    // Should be on user dashboard
    cy.url().should('include', '/user-dashboard');
    cy.contains('My Bookings').should('be.visible');
  });
});
