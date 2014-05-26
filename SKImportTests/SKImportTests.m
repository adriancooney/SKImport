//
//  SKImportTests.m
//  SKImportTests
//
//  Created by Adrian Cooney on 26/05/2014.
//  Copyright (c) 2014 Adrian Cooney. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "SKPhysicsBody+SKPhysicsBodyImport.h"
#define BUNDLE [NSBundle bundleWithIdentifier:@"com.sk.SKTestImport"]
#define FILE_PATH [BUNDLE pathForResource:@"example" ofType:@"json"]

@interface SKImportTests : XCTestCase

@end

@implementation SKImportTests
-(void) setUp {
    [super setUp];
    
    NSAssert(FILE_PATH != NULL, @"Example.json not found!");
}

- (void)testInitWithFile {
    NSLog(@"Testing..");
    SKPhysicsBody *b = [SKPhysicsBody bodyWithFile:FILE_PATH];
    
    NSAssert(b != NULL, @"Physics body is NULL");
    NSAssert([b area] > 0, @"Physics body has area of 0");
}

-(void)getJSONFile {
    id data = [SKPhysicsBody getJSONData:FILE_PATH];
    NSAssert(data != NULL, @"Data not retrieved.");
}

-(void)generatePath {
    // Generate a path
    UIBezierPath *genP = [SKPhysicsBody generatePathFromArrayOfPoint:@[@[@10, @30], @[@50, @60], @[@200, @400]]];
    
    // Manuall create the expected path
    UIBezierPath *actualP = UIBezierPath.bezierPath;
    [actualP moveToPoint:CGPointMake(10.0f, 30.0f)];
    [actualP addLineToPoint:CGPointMake(50.0f, 60.0f)];
    [actualP addLineToPoint:CGPointMake(400.0f, 200.0f)];
    [actualP closePath];
    
    
    NSAssert(genP != NULL, @"Path no generated.");
    NSAssert(genP.CGPath != NULL, @"CGPath not present.");
    
    CGPathRef cgGenP = genP.CGPath;
    CGPathRef cgActualP = actualP.CGPath;
    
    NSAssert(CGPathIsEmpty(cgGenP) != YES, @"Path is empty.");
    NSAssert(CGPathEqualToPath(cgGenP, cgActualP), @"Path in malformed.");
}

@end
