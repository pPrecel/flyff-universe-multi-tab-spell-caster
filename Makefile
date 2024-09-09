VERSION=1.0.0

BIN ?= $(PWD)/bin
$(BIN):
	@echo creating bin folder...
	mkdir -p $(BIN)
	@echo ""

.PHONY: cleanup-release
cleanup-release: $(BIN)
	@echo cleaning up...
	rm -f fumtsc-$(VERSION).zip
	rm -rf $(BIN)/*
	@echo ""

.PHONY: release
release: cleanup-release
	@echo making bin folder...
	cp *.json $(BIN)
	cp *.css $(BIN)
	cp *.js $(BIN)
	cp *.html $(BIN)
	cp -r images $(BIN)/images
	@echo ""

	@echo zipping...
	@bash -c "cd $(BIN); zip -vr ../fumtsc-$(VERSION).zip * -x \"*.DS_Store\""
	@echo ""

	@echo output folder: fumtsc-$(VERSION).zip
