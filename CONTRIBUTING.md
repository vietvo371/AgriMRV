# Contributing to AgriMRV

Thank you for your interest in contributing to AgriMRV! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI
- Git
- Code editor (VS Code recommended)

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/AgriMRV.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## 📝 Code Style

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type usage

### React Native
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling

### File Naming
- Use PascalCase for components: `UserProfile.tsx`
- Use camelCase for utilities: `apiHelper.ts`
- Use kebab-case for assets: `user-avatar.png`

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Writing Tests
- Write unit tests for utility functions
- Test component rendering and user interactions
- Maintain test coverage above 80%

## 📋 Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

4. **Push to Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Add screenshots if UI changes

## 🏷️ Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add biometric authentication
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**
   - OS version
   - React Native version
   - Device/emulator details

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior

3. **Additional Context**
   - Screenshots or videos
   - Error logs
   - Related issues

## 💡 Feature Requests

For feature requests:

1. Check existing issues first
2. Provide clear use case
3. Explain expected behavior
4. Consider implementation complexity

## 📚 Documentation

### Code Documentation
- Use JSDoc for functions and components
- Provide clear parameter descriptions
- Include usage examples

### README Updates
- Update README for new features
- Keep installation instructions current
- Add new screenshots when needed

## 🔒 Security

### Reporting Security Issues
- **DO NOT** create public issues for security vulnerabilities
- Email security concerns to: vietvo371@gmail.com
- Include detailed reproduction steps

### Security Best Practices
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate all user inputs
- Keep dependencies updated

## 🎯 Hackathon Contributions

### Priority Areas
1. **AI/ML Features**: Crop analysis, yield prediction
2. **Blockchain Integration**: Smart contracts, verification
3. **UI/UX Improvements**: Better user experience
4. **Performance**: App speed and efficiency
5. **Testing**: Increase test coverage

### Quick Wins
- Fix existing bugs
- Improve documentation
- Add new tests
- Optimize performance
- Enhance accessibility

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Email**: vietvo371@gmail.com

### Response Time
- Bug reports: 24-48 hours
- Feature requests: 1-2 weeks
- General questions: 2-3 days

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Hackathon presentations

## 📄 License

By contributing to AgriMRV, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AgriMRV! Together, we're building the future of agriculture. 🌱
