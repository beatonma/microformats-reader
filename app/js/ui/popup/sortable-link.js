class SortableLink {
    constructor(url) {
        this.url = String(url);
        this.protocol = "";
        this.domain = "";
        this.path = "";

        this.parse();
    }

    parse() {
        let stub = this.url;
        let protocol = stub.match(/^(\w+):(\/\/)?(.*)/);
        if (protocol) {
            this.protocol = String(protocol[1]);
            stub = protocol[3];
        }

        let domain = stub.match(/^(www\.)?([^\/]*)(.*)?/);
        if (domain) {
            this.domain = String(domain[2]);
            this.path = String(getValueOr(domain, 3, ""));
        }
    }

    asString() {
        return format(
            "{}|{}|{}:{}",
            this.protocol,
            this.domain,
            this.path,
            this.url
        );
    }
}
