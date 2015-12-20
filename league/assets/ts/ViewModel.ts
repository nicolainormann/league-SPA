/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/knockout/knockout.d.ts" />
///api/lol/{region}/v2.2/matchlist/by-summoner/{summonerId}
module League.ViewModels {
    export class PostViewModel {
        public post: KnockoutObservable<DtoPost>;
        public postName = ko.observable<string>("");
		private apiKey = <string>"api_key=0a8d68f4-5e00-4345-9f35-c098a7ebe45b";
		
        public constructor() {
            this.post = ko.observable<DtoPost>(new DtoPost());
            this.postName.subscribe(this.getSummoner);
        }

		public getSummoner = () => {
			$.ajax({
				url: 'https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/' + this.postName() + "?" + this.apiKey,
				method: 'GET'
			}).then(data => {
				this.post(<DtoPost>data[Object.keys(data)[0]]);
				this.getData();
			});
		}

        public getData = () => {
			var id = this.post().id;

			var services = [
				'v2.2/matchlist/by-summoner/' + id + "?" + this.apiKey,
				'v1.3/stats/by-summoner/' + id + '/ranked?season=SEASON2015&' + this.apiKey
			];

			for (var i = 0; i < services.length; i++) {
				$.ajax({
					url: 'https://euw.api.pvp.net/api/lol/euw/' + services[i],
					method: 'GET'
				}).then(data => {
					console.log(data);
					this.post(<DtoPost>data);
				});
			}
        }
    }

    export class DtoPost {
		public id = ko.observable<number>(0);
        public name = ko.observable<string>("");
        public summonerLevel = ko.observable<number>(0);
		public matches = ko.observableArray[10];
    }
}