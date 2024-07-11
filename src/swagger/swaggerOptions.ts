const port : string | undefined = process.env.PORT_SERVER || process.env.SUB_PORT_SERVER

export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Blog',
            version: '1.0.0',
            description: 'API Information',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server'
            }
        ]
    },
    apis: ['./src/openAPI/*.yaml'], // Đường dẫn tới file chứa định nghĩa các route
};