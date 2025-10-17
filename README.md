
---

## 🎨 Allure Report Features

- 📸 **Screenshots** - Auto capture on failure
- 🎥 **Videos** - Record test execution
- 📝 **Custom Steps** - Business-focused test logs
- 🏷️ **Tags & Categories** - Organize tests by features
- 📊 **Trends** - Track test stability over time
- 🔗 **Issue Tracking** - Link to JIRA/TMS

---

## 🧠 Best Practices

- ✅ Sử dụng **Page Object Model** cho tất cả page interactions
- ✅ Gọi `Reporter.logStep()` cho các business steps quan trọng
- ✅ Dùng **descriptive test names** và **comments** khi cần thiết
- ✅ Chạy `npm run clean` trước khi generate báo cáo mới
- ✅ Commit code nhưng **không commit** `allure-results/` và `allure-report/`
- ✅ Sử dụng `.env` file cho sensitive data (credentials, API keys)

---

## 🚧 Roadmap

- [ ] Thêm support cho **mobile testing** (iOS/Android)
- [ ] Tích hợp **CI/CD** (GitHub Actions / Jenkins)
- [ ] Upload Allure report lên **cloud storage**
- [ ] Thêm **API testing** với Playwright
- [ ] Visual regression testing với **Playwright Visual Comparisons**
- [ ] Parallel execution optimization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Lê Quang Bách**  
Automation Tester — FPT Software

---

<div align="center">

### ✨ Clean tests. Clear reports. Confident releases. ✨

Made with ❤️ using Playwright + TypeScript + Allure

</div>
