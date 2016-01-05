/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/knockout/knockout.d.ts" />

module League.ViewModels {
    export class PostViewModel {
        public summoner: KnockoutObservable<Summoner>;
		public summonerData: KnockoutObservable<SummonerData>;
		public dataObject = ko.observable({});
        public postName = ko.observable<string>("");
		private apiKey = <string>"api_key=0a8d68f4-5e00-4345-9f35-c098a7ebe45b";
		
        public constructor() {
            this.summoner = ko.observable<Summoner>(new Summoner());
            this.postName.subscribe(this.getSummoner);
        }

		public getSummoner = () => {
			$.ajax({
				url: 'https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/' + this.postName() + "?" + this.apiKey,
				method: 'GET'
			}).then(data => {
				this.dataObject({ "summonerData": <SummonerData>data[Object.keys(data)[0]] });
				this.populateSummonerDto();
			});
		}

		public populateSummonerDto = () => {
			this.summoner(<Summoner>this.dataObject());
		}
    }

    export class Summoner {
		public summonerData = ko.observable<SummonerData>();
    }

	export class SummonerData {
		public id = ko.observable<number>();
        public name = ko.observable<string>();
		public profileIconId = ko.observable<number>(0);
        public summonerLevel = ko.observable<number>();
    }
}


//module League.ViewModels {
//    export class PostViewModel {
//        public summoner: KnockoutObservable<Summoner>;
//		public matchList: KnockoutObservable<MatchList>;
//		public stats: KnockoutObservable<Stats>;
//		public matchArray: KnockoutObservable<MatchArray>;
//        public postName = ko.observable<string>("");
//		private apiKey = <string>"api_key=0a8d68f4-5e00-4345-9f35-c098a7ebe45b";

//        public constructor() {
//            this.summoner = ko.observable<Summoner>(new Summoner());
//			this.matchList = ko.observable<MatchList>(new MatchList());
//			this.stats = ko.observable<Stats>(new Stats());
//			this.matchArray = ko.observable<MatchArray>(new MatchArray());
//            this.postName.subscribe(this.getSummoner);
//        }

//		public getSummoner = () => {
//			$.ajax({
//				url: 'https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/' + this.postName() + "?" + this.apiKey,
//				method: 'GET'
//			}).then(data => {
//				console.log(data);
//				this.summoner(<Summoner>data[Object.keys(data)[0]]);
//				this.getData();
//			});
//		}

//        public getData = () => {
//			var id = this.summoner().id;


//			var services = [
//				'v2.2/matchlist/by-summoner/' + id + "?" + this.apiKey,
//				//'v1.3/stats/by-summoner/' + id + '/ranked?season=SEASON2015&' + this.apiKey
//			];

//			for (var i = 0; i < services.length; i++) {
//				$.ajax({
//					url: 'https://euw.api.pvp.net/api/lol/euw/' + services[i],
//					method: 'GET'
//				}).then(data => {
//					console.log(data);
//					this.matchList(<MatchList>data);
//					this.stats(<Stats>data);
//					this.getMatches();
//				});
//			}
//        }

//		public getMatches = () => {
//			var matches = this.matchList().matches;

//			for (var i = 0; i < 2; i++) {
//				$.ajax({
//					url: 'https://euw.api.pvp.net/api/lol/euw/v2.2/match/' + matches[i].matchId + "?" + this.apiKey,
//					method: 'GET'
//				}).then(data => {
//					console.log(data);
//				});
//			}
//		}
//    }

//    export class Summoner {
//		public id = ko.observable<number>();
//        public name = ko.observable<string>();
//		public profileIconId = ko.observable<number>(0);
//        public summonerLevel = ko.observable<number>();
//    }

//	export class MatchList {
//		public matches = ko.observableArray[0];
//	}

//	export class MatchArray {
//		public array = ko.observableArray[0];
//	}

//	export class Stats {
//		public champions = ko.observableArray[0];
//	}
//}