VERSION=1.0.0

.PHONY: cleanup-release
cleanup-release:
	@echo cleaning up...
	rm -f fumtsc-chrome-$(VERSION).zip
	rm -f fumtsc-firefox-$(VERSION).zip
	@echo ""

.PHONY: release
release: cleanup-release
	@echo zipping for chrome...
	@bash -c "cd chrome; zip -vr ../fumtsc-chrome-$(VERSION).zip * -x \"*.DS_Store\""
	@echo ""

	@echo zipping for firefox...
	@bash -c "cd firefox; zip -vr ../fumtsc-firefox-$(VERSION).zip * -x \"*.DS_Store\""
	@echo ""

	@echo output folders: fumtsc-chrome-$(VERSION).zip, fumtsc-firefox-$(VERSION).zip
