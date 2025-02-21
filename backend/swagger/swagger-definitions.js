module.exports = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Student Registration API",
      version: "1.0.0",
      description: "API for managing student registrations and courses",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Student: {
          type: "object",
          properties: {
            studentId: { type: "string" },
            name: { type: "string" },
            dateOfBirth: { type: "string", format: "date" },
            major: { type: "string" },
            email: {
              type: "string",
              readOnly: true,
              description: "Computed field based on student ID",
            },
          },
        },
        Course: {
          type: "object",
          properties: {
            courseId: { type: "string" },
            name: { type: "string" },
            credits: { type: "number" },
            startDate: { type: "string", format: "date" },
            instructor: {
              type: "string",
              description: "ID of the course instructor",
            },
          },
        },
        Enrollment: {
          type: "object",
          properties: {
            studentId: { type: "string" },
            courseId: { type: "string" },
            enrollmentDate: {
              type: "string",
              format: "date"
            },
            status: {
              type: "string",
              enum: ["active", "completed", "withdrawn"],
              default: "active",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
};
