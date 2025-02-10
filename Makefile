VERSION=1.1.1

.PHONY: cleanup-release
cleanup-release:
	@echo cleaning up...
	rm -f fumtsc-chrome-*.zip
	rm -f fumtsc-firefox-*.zip
	@echo ""

.PHONY: upgrade-manifest-version
upgrade-manifest-version:
	@echo upgrading firefox manifest version...
	@yq -p json -o json -i ".version=\"$(VERSION)\"" firefox/manifest.json
	@echo ""

	@echo upgrading chrome manifest version...
	@yq -p json -o json -i ".version=\"$(VERSION)\"" chrome/manifest.json
	@echo ""

.PHONY: release
release: cleanup-release upgrade-manifest-version
	@echo composing chrome dir...
	@cp -r content/* chrome/

	@echo zipping for chrome...
	@bash -c "cd chrome; zip -vr ../fumtsc-chrome-$(VERSION).zip * -x \"*.DS_Store\""
	@echo ""

	@echo composing firefox dir...
	@cp -r content/* firefox/

	@echo zipping for firefox...
	@bash -c "cd firefox; zip -vr ../fumtsc-firefox-$(VERSION).zip * -x \"*.DS_Store\""
	@echo ""

	@echo output folders: fumtsc-chrome-$(VERSION).zip, fumtsc-firefox-$(VERSION).zip
