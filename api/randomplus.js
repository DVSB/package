module.exports = function() {
	
	var
	randomplus={},
	luhn={};
	
	
	// calculate luhn return one number which works like control
	// sum for testing number, this number should be added to end
	// calculate(100) => 4 --- and --- validate(1004) => true
	luhn.calculate = function(originalStr){

		var sum=0, delta=[0,1,2,3,4,-4,-3,-2,-1,0], 
		deltaIndex, deltaValue;

		for (var i=0; i<originalStr.length; i++ ){
			sum += parseInt(originalStr.substring(i,i+1));
		}

		for (var i=originalStr.length-1; i>=0; i-=2){		
			sum += delta[parseInt(originalStr.substring(i,i+1))];
		}	

		if (10-(sum%10)===10){ return 0; }
		return 10-(sum%10);

	};


	// validation of luhn string, should be always true and we can
	// luhn sum is last number of string and should be always from
	// zero to nine
	luhn.validate = function(luhnStr){

		var luhnStrDigit, luhnStrLess;

		luhnStrDigit = parseInt(luhnStr.substring(luhnStr.length-1,luhnStr.length));
		luhnStrLess = luhnStr.substring(0,luhnStr.length-1);

		if (luhn.calculate(luhnStrLess)===parseInt(luhnStrDigit)){ return true; }	
		return false;

	};
	
	
	// fingerprint is connected uniq miliseconds and random number from
	// 100 to 900 (to have same lenght) and one number which provides
	// control sum (luhn function)
	randomplus.generate = function(){
		
		var random, luhnSum;
		random = Math.floor((Math.random()*800)+100) + new Date().getTime() - 1000000000000 + '';
		luhnSum = luhn.calculate(random);
		
		random = parseInt(random + luhnSum);
		return random+'';
		
	};
	
	
	// fingerprint is only short way how write longer number in deca base
	// we can also get real value of fingerprint with simple conversion 
	// from 36base string to number and after to string
	randomplus.encrypt = function(finterprint){

		return parseInt(finterprint, 36)+'';
		
	};
	
	
	return randomplus;
	
	
};
